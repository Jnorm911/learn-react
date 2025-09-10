"use client";
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TaskTable.module.css";
import TaskRow from "./task-row/TaskRow.jsx";

const TaskTable = ({ tasks = [], onToggleTask, onUpdateTask, onRemoveTask }) => {
  const [sort, setSort] = useState({ key: "id", dir: "asc" });
  const [sortPref, setSortPref] = useState("none"); // none | category | completed
  useEffect(() => {
    try {
      const saved = localStorage.getItem("taskTable.sort");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.key && parsed.dir) {
          setSort(parsed);
          return;
        }
      }
    } catch {}
    setSort({ key: "priority", dir: "desc" });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("taskTable.sort", JSON.stringify(sort));
    } catch {}
  }, [sort]);
  // Load persisted preference and apply if set
  useEffect(() => {
    try {
      const pref = localStorage.getItem("taskTable.sortPref");
      if (pref === "category" || pref === "completed") {
        setSortPref(pref);
        setSort({ key: pref, dir: "asc" });
      }
    } catch {}
  }, []);

  const handlePrefChange = (e) => {
    const v = e.target.value;
    setSortPref(v);
    try { localStorage.setItem("taskTable.sortPref", v); } catch {}
    if (v === "none") return;
    setSort({ key: v, dir: "asc" });
  };
  const [query, setQuery] = useState("");
  const handleHeaderClick = (key) => {
    if (sortPref !== "none") {
      setSortPref("none");
      try { localStorage.setItem("taskTable.sortPref", "none"); } catch {}
    }
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };
  const arrowFor = (key) => (sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "");

  const sortedRows = useMemo(() => {
    const copy = [...tasks];
    const { key, dir } = sort;
    copy.sort((a, b) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (av == null && bv == null) return 0;
      if (av == null) return dir === "asc" ? 1 : -1; // nulls last
      if (bv == null) return dir === "asc" ? -1 : 1;
      if (typeof av === "string" && typeof bv === "string") {
        const res = av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" });
        return dir === "asc" ? res : -res;
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [tasks, sort]);

  const filteredRows = useMemo(() => {
    if (!query) return sortedRows;
    const lowerQuery = query.toLowerCase();
    return sortedRows.filter((task) => task.name.toLowerCase().includes(lowerQuery));
  }, [sortedRows, query]);

  if (filteredRows.length === 0) {
    return (
      <div className={styles.container}>
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>Sort Pref:</span>
          <select value={sortPref} onChange={handlePrefChange} aria-label="Sort preference">
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search tasks"
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} scope="col" onClick={() => handleHeaderClick("id")} title="Sort by ID">ID{arrowFor("id")}</th>
            <th className={styles.th} scope="col" onClick={() => handleHeaderClick("name")} title="Sort by Name">Name{arrowFor("name")}</th>
            <th className={styles.th} scope="col" onClick={() => handleHeaderClick("category")} title="Sort by Category">Category{arrowFor("category")}</th>
            <th className={styles.th} scope="col" onClick={() => handleHeaderClick("priority")} title="Sort by Priority">Priority{arrowFor("priority")}</th>
            <th className={styles.th} scope="col" onClick={() => handleHeaderClick("completed")} title="Sort by Completed">Completed{arrowFor("completed")}</th>
            <th className={styles.th} scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((task, idx) => (
            <TaskRow
              key={task?.id ?? idx}
              task={task}
              onToggleTask={onToggleTask}
              onUpdateTask={onUpdateTask}
              onRemoveTask={onRemoveTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      priority: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      category: PropTypes.string,
    })
  ),
  onToggleTask: PropTypes.func,
  onUpdateTask: PropTypes.func,
  onRemoveTask: PropTypes.func,
};

export default TaskTable;
