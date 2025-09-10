// PropTypes validate props at runtime (like lightweight TypeScript checks), not required.
import PropTypes from "prop-types";
import styles from "./TaskList.module.css";
// TaskList is a child component of TaskManager.
// It renders(displays) tasks using map and provides UI (checkboxes and buttons) for CRUD requests, which are handled by the parent.
const TaskList = ({ tasks, onToggleTask, onEditTask, onRemoveTask }) => {
  return (
    <div className={styles.container}>
      <ul>
        {/* map takes each task object from the base state as params */}
        {tasks.map(({ id, name, completed, priority, category }) => (
          <li key={id} className={styles.taskRow}>
            <div className={styles.taskContent}>
              <label className={styles.taskLabel}>
                {/* each row has UI for requests (checkbox to toggle completion) */}
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => onToggleTask(id)}
                />
                {name} <span>({priority})</span> <em>{category}</em>
              </label>
              {/* each row also has request buttons to edit or remove the task */}
              <button onClick={() => onEditTask(id)}>Edit</button>
              <button onClick={() => onRemoveTask(id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      priority: PropTypes.number,
      category: PropTypes.string,
    })
  ).isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
};

export default TaskList;
