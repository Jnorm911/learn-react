"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import tableStyles from "../TaskTable.module.css";
import styles from "./TaskRow.module.css";
import { PRIORITY_OPTIONS } from "../../../../../services/constants.js";

const normPriority = (v) => (Number.isFinite(v) ? Math.trunc(v) : 5);
const asDraft = (t) => ({
  name: t?.name ?? "",
  category: t?.category ?? "",
  priority: normPriority(t?.priority),
  completed: !!t?.completed,
});

export default function TaskRow({ task, onToggleTask, onUpdateTask, onRemoveTask }) {
  const { id, name, category, priority, completed } = task || {};
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => asDraft(task));

  function beginEdit() {
    setDraft(asDraft(task));
    setEditing(true);
  }

  function change(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  async function saveEdit() {
    await onUpdateTask?.(id, { ...draft, priority: normPriority(draft.priority) });
    setEditing(false);
  }

  return (
    <tr className={tableStyles.row}>
      <td className={tableStyles.td}>{id ?? "-"}</td>
      <td className={tableStyles.td}>
        {editing ? (
          <input
            className={styles.input}
            value={draft.name}
            onChange={(e) => change("name", e.target.value)}
          />
        ) : (
          name ?? "-"
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
          category ?? "-"
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
          Number.isFinite(priority) ? Math.trunc(priority) : "-"
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
              <button className={styles.button} onClick={() => setEditing(false)}>
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
