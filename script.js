// Select elements
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");

// Current filter state
let currentFilter = "all";

// Load tasks and theme from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  themeToggle.querySelector(".theme-icon").textContent = isDarkMode ? "☀️" : "🌙";
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Load theme preference
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector(".theme-icon").textContent = "☀️";
  }
}

// Add new task
addBtn.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText !== "") {
    addTask(taskText);
    saveTask(taskText);
    input.value = "";
  }
});

// Add task on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const taskText = input.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      saveTask(taskText);
      input.value = "";
    }
  }
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  const completedTasks = document.querySelectorAll("#task-list li.completed");
  completedTasks.forEach(task => task.remove());
  updateLocalStorage();
});

// Filter tasks
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    // Get filter type
    currentFilter = btn.dataset.filter;
    
    // Apply filter
    applyFilter();
  });
});

function applyFilter() {
  const tasks = document.querySelectorAll("#task-list li");
  
  tasks.forEach(task => {
    const isCompleted = task.classList.contains("completed");
    
    switch(currentFilter) {
      case "all":
        task.style.display = "flex";
        break;
      case "active":
        task.style.display = isCompleted ? "none" : "flex";
        break;
      case "completed":
        task.style.display = isCompleted ? "flex" : "none";
        break;
    }
  });
}

// Add task to the DOM
function addTask(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;
  if (completed) li.classList.add("completed");
  li.setAttribute("tabindex", "0");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
    applyFilter();
  });

  // Delete task on Delete key
  li.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
      li.remove();
      updateLocalStorage();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Save new task to localStorage
function saveTask(taskText) {
  const tasks = getTasks();
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load saved tasks
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Get tasks from localStorage
function getTasks() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Update tasks in localStorage
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
