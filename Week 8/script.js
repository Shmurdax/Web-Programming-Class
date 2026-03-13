// Grab the form element (we listen for submit on the FORM)
const form = document.getElementById("taskForm");

// Grab the input element (we read what the user typed)
const input = document.getElementById("taskInput");

// Grab the UL where tasks will be displayed
const taskList = document.getElementById("taskList");

// Grab the error message paragraph for validation feedback
const errorMessage = document.getElementById("errorMessage");

// Grab count elements so we can update totals
const totalCountEl = document.getElementById("totalCount");
const doneCountEl = document.getElementById("doneCount");

// Grab action buttons
const clearCompletedBtn = document.getElementById("clearCompleted");
const clearAllBtn = document.getElementById("clearAll");

// Grab all filter buttons (All/Active/Completed)
const filterButtons = document.querySelectorAll(".filters .btn");

// New selections for required features
const searchInput = document.getElementById("searchInput");
const charCountEl = document.getElementById("charCount");
const addButton = form.querySelector('button[type="submit"]');

// Our tasks array will store objects like:
// { id: 123, text: "Buy milk", done: false, createdAt: 1741880000000 }
let tasks = [];

// Track which filter is active
let currentFilter = "all";

// Search term (updated live)
let searchTerm = "";

// Key name used in localStorage
const STORAGE_KEY = "portfolio_todo_tasks";

// Save tasks array into localStorage (as a string)
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks array from localStorage
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  // If nothing saved, do nothing
  if (!saved) return;

  // Convert saved string back into array
  tasks = JSON.parse(saved);

  // Backward compatibility: ensure every task has a createdAt timestamp
  tasks.forEach(task => {
    if (!task.createdAt) {
      task.createdAt = Date.now();
    }
  });
}


// Show an error message on the page
function showError(message) {
  errorMessage.textContent = message;
}

// Clear the error message
function clearError() {
  errorMessage.textContent = "";
}

// Enable/disable the Add button based on input content
function updateAddButton() {
  addButton.disabled = input.value.trim() === "";
}


// Update Total and Completed counters (always based on ALL tasks)
function updateCounts() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;

  totalCountEl.textContent = `Total: ${total}`;
  doneCountEl.textContent = `Completed: ${completed}`;
}

// Decide if a task should be visible based on currentFilter
function passesFilter(task) {
  if (currentFilter === "all") return true;
  if (currentFilter === "active") return !task.done;
  if (currentFilter === "completed") return task.done;
  return true;
}

// Check if task matches current search term
function matchesSearch(task) {
  if (!searchTerm) return true;
  return task.text.toLowerCase().includes(searchTerm);
}

// Build ONE list item element for a task object
function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.id = task.id;

  // Task text container
  const span = document.createElement("span");
  span.classList.add("task-text");

  // Format timestamp
  let timeStr = "Unknown time";
  if (task.createdAt) {
    const date = new Date(task.createdAt);
    timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  // Inner spans for styling
  const textPart = document.createElement("span");
  textPart.textContent = task.text;

  const timePart = document.createElement("span");
  timePart.classList.add("timestamp");
  timePart.textContent = ` – Added at ${timeStr}`;

  span.appendChild(textPart);
  span.appendChild(timePart);

  if (task.done) {
    span.classList.add("done");
  }

  // Toggle done when clicking anywhere on the task text
  span.addEventListener("click", function () {
    task.done = !task.done;
    span.classList.toggle("done");
    saveTasks();
    render();
  });

  // Buttons container
  const btnBox = document.createElement("div");
  btnBox.classList.add("task-buttons");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.classList.add("btn", "ghost", "small");
  editBtn.addEventListener("click", function () {
    const newText = prompt("Edit the task:", task.text);
    if (newText === null) return; // user cancelled

    const trimmed = newText.trim();
    if (trimmed === "") {
      alert("Task cannot be empty.");
      return;
    }

    // Optional: prevent turning into a duplicate of another task
    const isDuplicate = tasks.some(t => t.id !== task.id && t.text.trim().toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      alert("A task with that text already exists.");
      return;
    }

    task.text = trimmed;
    saveTasks();
    render();
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.textContent = "Delete";
  delBtn.classList.add("btn", "danger", "small");
  delBtn.addEventListener("click", function () {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    render();
  });

  btnBox.appendChild(editBtn);
  btnBox.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(btnBox);

  return li;
}

// Render the entire list (respects filter + search)
function render() {
  taskList.innerHTML = "";

  let visibleCount = 0;

  for (const task of tasks) {
    if (passesFilter(task) && matchesSearch(task)) {
      const li = createTaskElement(task);
      taskList.appendChild(li);
      visibleCount++;
    }
  }

  // Show "No tasks available" when the visible list is empty
  if (visibleCount === 0) {
    const msgLi = document.createElement("li");
    msgLi.classList.add("no-tasks");
    msgLi.textContent = "No tasks available.";
    taskList.appendChild(msgLi);
  }

  updateCounts();
}


// Handle form submission (Add task)
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    showError("Task cannot be empty.");
    return;
  }

  // Prevent duplicate tasks (case-insensitive, ignores extra spaces)
  const isDuplicate = tasks.some(t => t.text.trim().toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    showError("Task already exists.");
    return;
  }

  clearError();

  const newTask = {
    id: Date.now(),
    text: text,
    done: false,
    createdAt: Date.now()
  };

  tasks.push(newTask);
  saveTasks();

  // Clear input and reset counter + button state
  input.value = "";
  charCountEl.textContent = "Characters: 0";
  updateAddButton();

  render();
});

// Live character counter + button enable/disable + clear error
input.addEventListener("input", function () {
  const len = input.value.length;
  charCountEl.textContent = `Characters: ${len}`;

  if (input.value.trim() !== "") {
    clearError();
  }

  updateAddButton();
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function () {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

// Clear ALL tasks with confirmation
clearAllBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    render();
  }
});

// Filter buttons
for (const btn of filterButtons) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;

    for (const b of filterButtons) {
      b.classList.remove("active");
    }
    btn.classList.add("active");

    render();
  });
}

// Live search (updates while typing)
searchInput.addEventListener("input", function () {
  searchTerm = searchInput.value.toLowerCase().trim();
  render();
});


// Load saved tasks when page opens
loadTasks();

// Initial UI state
charCountEl.textContent = "Characters: 0";
updateAddButton();
render();