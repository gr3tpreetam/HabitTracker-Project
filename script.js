let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const stats = document.getElementById("stats");
const filterButtons = document.querySelector(".filters");

form.addEventListener("submit", addTask);
filterButtons.addEventListener("click", handleFilter);

function addTask(e) {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") {
    alert("Task cannot be empty");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(task);
  saveAndRender();
  input.value = "";
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveAndRender();
}

function handleFilter(e) {
  if (e.target.tagName === "BUTTON") {
    currentFilter = e.target.dataset.filter;
    renderTasks();
  }
  document
    .querySelectorAll(".filters button")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
}

function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.completed ? "completed" : "";
    span.onclick = () => toggleTask(task.id);

    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = () => deleteTask(task.id);

    li.append(span, del);
    list.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const completed = tasks.filter((t) => t.completed).length;
  stats.textContent = `Completed ${completed} of ${tasks.length} tasks`;
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
