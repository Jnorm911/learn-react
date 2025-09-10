// services/taskService.js
const API_URL = "https://68bf55439c70953d96ef5630.mockapi.io/api/v1/TaskManager";

// Read (in CRUD)
export async function fetchTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}