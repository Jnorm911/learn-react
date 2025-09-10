"use client";
import { useId, useState } from "react";
import PropTypes from "prop-types";
import styles from "./TaskForm.module.css";
import { createTask } from "../../../../services/taskService.js";
import { PRIORITY_OPTIONS } from "../task-table/task-row/TaskRow.jsx";

const initialForm = {
  name: "",
  category: "",
  priority: 5,   // 1 = Low, 5 = Medium, 10 = High
  completed: false,
};

const TaskForm = ({ onAddTask }) => {
  const [form, setForm] = useState(() => ({ ...initialForm }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const uid = useId();

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    // keep types stable in state
    const next =
      type === "checkbox" ? checked :
      name === "priority" ? Number(value) :
      value;
    setForm(prev => ({ ...prev, [name]: next }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError("Task name is required.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const created = await createTask({
        name: trimmedName,
        category: form.category.trim() || undefined,
        priority: form.priority,       // already a number
        completed: !!form.completed,
      });
      onAddTask?.(created);
      setForm({ ...initialForm });     // reset with a fresh object
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const nameId = `${uid}-name`;
  const categoryId = `${uid}-category`;
  const priorityId = `${uid}-priority`;
  const completedId = `${uid}-completed`;
  const errorId = `${uid}-error`;

  return (
    <div className={styles.container}>
      <h2>Create Task</h2>
      {error && (
        <p id={errorId} role="alert" aria-live="assertive" className={styles.error}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <fieldset disabled={submitting} className={styles.fieldset}>
          <div className={styles.fieldRow}>
            <label htmlFor={nameId} className={styles.label}>Name</label>
            <input
              id={nameId}
              name="name"
              type="text"
              className={styles.input}
              placeholder="e.g., Fix bug #123"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor={categoryId} className={styles.label}>Category</label>
            <input
              id={categoryId}
              name="category"
              type="text"
              className={styles.input}
              placeholder="e.g., Engineering"
              value={form.category}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor={priorityId} className={styles.label}>Priority</label>
            <select
              id={priorityId}
              name="priority"
              className={styles.select}
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldRowCheckbox}>
            <label htmlFor={completedId} className={styles.checkboxLabel}>
              <input
                id={completedId}
                name="completed"
                type="checkbox"
                checked={form.completed}
                onChange={handleChange}
              />
              Completed
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              {submitting ? "Saving…" : "Add Task"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  onAddTask: PropTypes.func,
};

export default TaskForm;