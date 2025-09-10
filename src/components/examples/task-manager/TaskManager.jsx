"use client";
// imports self explanatory
import { useState, useEffect } from "react";
import styles from "./TaskManager.module.css";
import TaskTable from "./task-table/TaskTable.jsx";
import TaskForm from "./task-form/TaskForm.jsx";
import { fetchTasks, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "../../../services/taskService.js";
// all base components are fucntions in modern React
export default function TaskManager() {
// Typical react state for parent componenet, children remain immutable
  const [tasks, setTasks] = useState([]);
// Empty array([]) means run once on the first render, fetchs the initial tasks
  useEffect(() => {
    (async () => {
      const data = await fetchTasks();
      // set ensures the arrays are correct after user request
      setTasks(Array.isArray(data) ? data : []);
    })();
  }, []);

// Method that ensures all updates (CRUD) work because the ID aligns
  const updateTask = async (id, updates) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const saved = await apiUpdateTask(id, { ...current, ...updates });
    setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
  };
// returns jsx which happens to look like html but it's really a wrapper. Also this is the orchestrator for the children components, hence the service
  return (
    <div className={styles.container}>
      <h1>Task Manager</h1>
      {/* Child component to create new tasks via child component(CRUD)*/}
      <TaskForm
        onAddTask={(newTask) => setTasks((prev) => [newTask, ...prev])}
      />
      <TaskTable
      // read
        tasks={tasks}
        // Special use case becaues I wanted to have a live checkmark instead of true/false column
        onToggleTask={(id) =>
          updateTask(id, { completed: !tasks.find((t) => t.id === id)?.completed })
        }
        // update any column
        onUpdateTask={(id, updates) => updateTask(id, updates)}
        // delete row
        onRemoveTask={async (id) => {
          await apiDeleteTask(id);
          // ensure the array is correct after user request
          setTasks((prev) => prev.filter((t) => t.id !== id));
        }}
      />
    </div>
  );
}
