"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import tableStyles from "../TaskTable.module.css";
import styles from "./TaskRow.module.css";

export const PRIORITY_OPTIONS = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 5 },
  { label: "High", value: 10 },
];

export default function TaskRow({ task, onToggleTask, onUpdateTask, onRemoveTask }) {
  const { id, name, category, priority, completed } = task || {};
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: name ?? "",
    category: category ?? "",
    priority: Number.isFinite(priority) ? Math.trunc(priority) : 5,
    completed: !!completed,
  });

  function beginEdit() {
    setDraft({
      name: name ?? "",
      category: category ?? "",
      priority: Number.isFinite(priority) ? Math.trunc(priority) : 5,
      completed: !!completed,
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function change(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function saveEdit() {
    await onUpdateTask?.(id, { ...draft, priority: Number.isFinite(draft.priority) ? Math.trunc(draft.priority) : 5 });
    setEditing(false);
  }

  return (
    <tr className={tableStyles.row}>
      <td className={tableStyles.td}>{String(id ?? "-")}</td>
      <td className={tableStyles.td}>
        {editing ? (
          <input
            className={styles.input}
            value={draft.name}
            onChange={(e) => change("name", e.target.value)}
          />
        ) : (
          String(name ?? "-")
        )}
      </td>
      <td className={tableStyles.td}>
        {editing ? (
          <input
            className={styles.input}
            value={draft.category}
            onChange={(e) => change("category", e.target.value)}
          />
        ) : (
          String(category ?? "-")
        )}
      </td>
      <td className={tableStyles.td}>
        {editing ? (
          <select
            className={styles.select}
            value={draft.priority}
            onChange={(e) => change("priority", Number(e.target.value))}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        ) : (
          String(Number.isFinite(priority) ? Math.trunc(priority) : "-")
        )}
      </td>
      <td className={tableStyles.td}>
        {editing ? (
          <input
            type="checkbox"
            checked={!!draft.completed}
            onChange={(e) => change("completed", e.target.checked)}
          />
        ) : (
          <input
            type="checkbox"
            checked={!!completed}
            onChange={() => onToggleTask?.(id)}
          />
        )}
      </td>
      <td className={tableStyles.td}>
        <div className={styles.actions}>
          {editing ? (
            <>
              <button className={styles.button} onClick={saveEdit}>
                Save
              </button>
              <button className={styles.button} onClick={cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className={styles.button} onClick={beginEdit}>
                Edit
              </button>
              <button className={styles.buttonDanger} onClick={() => onRemoveTask?.(id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

TaskRow.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    category: PropTypes.string,
    priority: PropTypes.number,
    completed: PropTypes.bool,
  }),
  onToggleTask: PropTypes.func,
  onUpdateTask: PropTypes.func,
  onRemoveTask: PropTypes.func,
};
