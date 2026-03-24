const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" class="complete-checkbox" />
        <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
      </div>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") return;

  addTask(text);
  taskInput.value = "";
});

taskList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    deleteTask(id);
  }

  if (e.target.classList.contains("complete-checkbox")) {
    const id = Number(e.target.dataset.id);
    toggleTask(id);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

renderTasks();
