let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const stats = document.getElementById("stats");
const filters = document.querySelector(".filters");

form.addEventListener("submit", addTask);
filters.addEventListener("click", handleFilter);

function addTask(e) {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") {
    alert("Task cannot be empty");
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(task);
  input.value = "";
  saveAndRender();
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
  if (e.target.tagName !== "BUTTON") return;

  currentFilter = e.target.dataset.filter;

  document
    .querySelectorAll(".filters button")
    .forEach((btn) => btn.classList.remove("active"));

  e.target.classList.add("active");

  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.toggle("completed", task.completed);
    span.addEventListener("click", () => toggleTask(task.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const completedCount = tasks.filter((task) => task.completed).length;
  stats.textContent = `Completed ${completedCount} of ${tasks.length} tasks`;
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
