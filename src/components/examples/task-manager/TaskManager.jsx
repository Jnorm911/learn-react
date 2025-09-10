"use client";
// TaskManager.jsx
import { useState, useEffect } from "react";
import styles from "./TaskManager.module.css";
import TaskTable from "./task-table/TaskTable.jsx";
import TaskForm from "./task-form/TaskForm.jsx";
import { fetchTasks, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "../../../services/taskService.js";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTasks();
        if (active) setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError("Failed to load tasks.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>Task Manager</h1>
      {/* Create new tasks */}
      <TaskForm
        onAddTask={(newTask) =>
          setTasks((prev) => (Array.isArray(prev) ? [newTask, ...prev] : [newTask]))
        }
      />
      {loading && <p>Loading tasks…</p>}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {!loading && !error && (
        <TaskTable
          tasks={tasks}
          onToggleTask={async (id) => {
            try {
              const current = (tasks || []).find((t) => t?.id === id);
              if (!current) return;
              const updated = { ...current, completed: !current.completed };
              const saved = await apiUpdateTask(id, updated);
              setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
            } catch (e) {
              setError("Failed to update task.");
            }
          }}
          onUpdateTask={async (id, updates) => {
            try {
              const current = (tasks || []).find((t) => t?.id === id);
              if (!current) return;
              const payload = { ...current, ...updates };
              const saved = await apiUpdateTask(id, payload);
              setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
            } catch (e) {
              setError("Failed to update task.");
            }
          }}
          onRemoveTask={async (id) => {
            try {
              await apiDeleteTask(id);
              setTasks((prev) => prev.filter((t) => t.id !== id));
            } catch (e) {
              setError("Failed to delete task.");
            }
          }}
        />
      )}
    </div>
  );
}
