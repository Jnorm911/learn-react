"use client";
// TaskManager.jsx
import { useState, useEffect } from "react";
import styles from "./TaskManager.module.css";
import { RowList, Row } from "../../ui/RowList/RowList";
import TaskControls from "./task-controls/TaskControls";
import TaskForm from "./task-form/TaskForm";
import TaskList from "./task-list/TaskList";
import TaskSorter from "./task-sorter/TaskSorter";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../../services/taskService";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(Array.isArray(data) ? data : data?.data ?? []);
      })
      .catch((err) => console.error(err));
  }, []);

  const addTask = (name) => {
    const newTask = { name, completed: false };
    createTask(newTask)
      .then((createdTask) => setTasks((prev) => [...prev, createdTask]))
      .catch((err) => console.error(err));
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    updateTask(id, updatedTask)
      .then((data) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
      )
      .catch((err) => console.error(err));
  };

  const editTask = (id, newName) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, name: newName };
    updateTask(id, updatedTask)
      .then((data) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
      )
      .catch((err) => console.error(err));
  };

  const removeTask = (id) => {
    deleteTask(id)
      .then(() => setTasks((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.container}>
      <h1>Task Manager</h1>
      <RowList>
        <Row>
          <TaskControls
            tasks={tasks}
            toggleTask={toggleTask}
            removeTask={removeTask}
            editTask={editTask}
          />
        </Row>
        <Row>
          <TaskForm addTask={addTask} />
        </Row>
        <Row>
          <TaskSorter tasks={tasks} setTasks={setTasks} />
        </Row>
        <Row>
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onEditTask={editTask}
            onRemoveTask={removeTask}
          />
        </Row>
      </RowList>
    </div>
  );
};

export default TaskManager;