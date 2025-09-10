"use client";
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TaskTable.module.css";
import TaskRow from "./task-row/TaskRow.jsx";

const TaskTable = ({ tasks = [], onToggleTask, onUpdateTask, onRemoveTask }) => {
  const [sort, setSort] = useState({ key: "id", dir: "asc" });
  const [sortPref, setSortPref] = useState(() => {
    try {
      const pref = localStorage.getItem("taskTable.sortPref");
      return pref === "category" || pref === "completed" ? pref : "none";
    } catch {}
    return "none";
  });
  useEffect(() => {
    if (sortPref !== "none") setSort({ key: sortPref, dir: "asc" });
  }, [sortPref]);

  const handlePrefChange = (e) => {
    const v = e.target.value;
    setSortPref(v);
    try { localStorage.setItem("taskTable.sortPref", v); } catch {}
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
            {[
              { key: "id", label: "ID" },
              { key: "name", label: "Name" },
              { key: "category", label: "Category" },
              { key: "priority", label: "Priority" },
              { key: "completed", label: "Completed" },
            ].map((c) => (
              <th
                key={c.key}
                className={styles.th}
                scope="col"
                onClick={() => handleHeaderClick(c.key)}
                title={`Sort by ${c.label}`}
              >
                {c.label}
                {arrowFor(c.key)}
              </th>
            ))}
            <th className={styles.th} scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <tr className={styles.row}>
              <td className={styles.td} colSpan={6}>No tasks found.</td>
            </tr>
          ) : (
            filteredRows.map((task, idx) => (
              <TaskRow
                key={task?.id ?? idx}
                task={task}
                onToggleTask={onToggleTask}
                onUpdateTask={onUpdateTask}
                onRemoveTask={onRemoveTask}
              />
            ))
          )}
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
