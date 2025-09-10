"use client";
import { useId, useState } from "react";
import PropTypes from "prop-types";
import styles from "./TaskForm.module.css";
import { createTask } from "../../../../services/taskService.js";
import { PRIORITY_OPTIONS } from "../../../../services/constants.js";

// default state before manipulation and after reset
const initialForm = {
  name: "",
  category: "",
  priority: 5,   // 1 = Low, 5 = Medium, 10 = High
  completed: false,
};

// method for creating a task via CRUD
const TaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState(() => ({ ...initialForm }));
  // React function to assign special id to each datapoint
  const uid = useId();
  const idFor = (s) => `${uid}-${s}`;
// event that handles html style inputs generically to match the api value
  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    const next =
      type === "checkbox" ? checked :
      name === "priority" ? Number(value) :
      value;
    setFormData(prev => ({ ...prev, [name]: next }));
  }
// focus here
  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      return;
    }
    try {
      const created = await createTask({
        name: trimmedName,
        category: formData.category.trim() || undefined,
        priority: formData.priority,       // already a number
        completed: !!formData.completed,
      });
      onAddTask?.(created);
      setFormData({ ...initialForm });     // reset with a fresh object
    } catch (err) {
    }
  }

  return (
    <div className={styles.container}>
      <h2>Create Task</h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <fieldset className={styles.fieldset}>
          <div className={styles.fieldRow}>
            <label htmlFor={idFor("name")} className={styles.label}>Name</label>
            <input
              id={idFor("name")}
              name="name"
              type="text"
              className={styles.input}
              placeholder="e.g., Fix bug #123"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor={idFor("category")} className={styles.label}>Category</label>
            <input
              id={idFor("category")}
              name="category"
              type="text"
              className={styles.input}
              placeholder="e.g., Engineering"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor={idFor("priority")} className={styles.label}>Priority</label>
            <select
              id={idFor("priority")}
              name="priority"
              className={styles.select}
              value={formData.priority}
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
            <label htmlFor={idFor("completed")} className={styles.checkboxLabel}>
              <input
                id={idFor("completed")}
                name="completed"
                type="checkbox"
                checked={formData.completed}
                onChange={handleChange}
              />
              Completed
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Add Task
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
