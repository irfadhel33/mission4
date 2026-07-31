// ===========================================================
// DOM REFS
// ===========================================================
const inputText = document.getElementById("taskInput");
const submit = document.getElementById("submitBtn");

const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList")

const todoCount = document.getElementById("todoCount");
const doneCount = document.getElementById("doneCount");

const deleteAllBtn = document.getElementById("deleteAllBtn")
const priorityOptions = document.querySelectorAll(".priority-option");

const dayDisplay = document.getElementById("dayDisplay");
const dateDisplay = document.getElementById("dateDisplay");


// ===========================================================
// DATA
// ===========================================================
let tasks = [];
let nextId = 1;


// ===========================================================
// UTILITIES
// ===========================================================
function getSelectedPriority() {
  const selected = document.querySelector('input[name="priority"]:checked');

  return selected.value;
}

const formatDate = (date) => {
  return date.toLocaleDateString("id-ID" , {
    day : "numeric",
    month : "short"
  });
}

function updateDate() {
  const now = new Date()
  const day = now.toLocaleDateString("id-ID", {
    weekday: "long"
  });

  const date = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  dayDisplay.textContent = day;
  dateDisplay.textContent = date;
}

function updateBadge() {
  todoCount.textContent = tasks.filter(task => !task.completed).length;
  doneCount.textContent = tasks.filter(task => task.completed).length;
}


// ===========================================================
// STORAGE
// ===========================================================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storageTasks = localStorage.getItem("tasks");

  if (storageTasks) {
    tasks = JSON.parse(storageTasks);
    // ketika storageTasks keadaannya true maka variable tasks akan berisi storageTask yang sudah diubah menjadi array
    
    tasks.forEach(task => {
      task.createdAt = new Date(task.createdAt);
    });

    nextId = Math.max(...tasks.map(task => task.id)) + 1;
    // spread operator (...) mengubah array menjadi string
  }
}


// ===========================================================
// CRUD (CREATE, READ, UPDATE, DELETE)
// ===========================================================
function addTask() {
  const task = inputText.value.trim();

  if (task === "") {
    alert("Masukkan tugas terlebih dahulu!");
    return;
  }

  tasks.push({
    id: nextId++,
    text: task,
    completed: false,
    priority: getSelectedPriority(),
    createdAt: new Date()
  });

  saveTasks();
  renderTask();

  inputText.value = "";
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  // kenapa list yang buttonya dipencet kedelete? itu karena tasks di sini diperbaharui menjadi task task yang id button nya tidak dipencet yang mana sebelumnya task berisi baik id yang buttonya dipencet atau tidak
  saveTasks();
  renderTask();
}

const deleteAllTask = () => {
  const confirmed = confirm("Hapus semua tugas?");
  if (!confirmed) {
    return;
  }
  tasks = [];

  saveTasks();
  renderTask();
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  task.completed = !task.completed;

  saveTasks();
  renderTask();
}

// ===========================================================
// EVENT HANDLER
// ===========================================================
function handleClick(event) {
  const li = event.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.id);
  

  // CHECKLIST BUTTON
  if (event.target.closest(".checkbox")) {
    toggleTask(id);
    return;
  }

  // DELETE BUTTON
  if (event.target.closest(".delete-btn")) {
    deleteTask(id);
    return;
  }
}

function updatePriorityActive(event) {
  priorityOptions.forEach(option => {
    option.classList.remove("active")
  });

  event.currentTarget.classList.add("active");
}


// ===========================================================
// RENDERS (UPDATE UI)
// ===========================================================
function renderTask() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  for (const task of tasks) {
    if (task.completed) {
      doneList.innerHTML += createTaskHTML(task);
      } else {
        todoList.innerHTML += createTaskHTML(task);
      }
    }

    if (todoList.innerHTML === "") {
      todoList.innerHTML = `
      <li class="empty-state">
        <i class="fas fa-inbox"></i>
        Belum ada Tugas. Tambahkan dahulu!
      </li>
      `;
    }

    if (doneList.innerHTML === "") {
      doneList.innerHTML = `
        <li class="empty-state">
          <i class="fas fa-check-double"></i>
          Belum ada tugas selesai.
        </li>
        `;
    }
    
    updateBadge()
}

function createTaskHTML(task) {
  return `
  <li class="task-item" data-id="${task.id}">
      <div class="checkbox ${task.completed ? "checked" : ""}">
        <i class="fa-solid fa-check"></i>
      </div>
      
      <span class="task-text ${task.completed ? "done-text" : ""}">
        ${task.text}
      </span>

      <span class="priority-tag ${task.priority}">${task.priority}</span>
      
      <span class="task-date">${formatDate(task.createdAt)}</span>
      
      <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>

    </li>
  `;
}


// ===========================================================
// INIT
// ===========================================================

loadTasks();
renderTask();
updateDate();


// ===========================================================
// EVENTS LISTENER
// ===========================================================
submit.addEventListener("click", addTask);
todoList.addEventListener("click", handleClick);
doneList.addEventListener("click", handleClick);
deleteAllBtn.addEventListener("click", deleteAllTask);
priorityOptions.forEach(option => {
    option.addEventListener("click", updatePriorityActive);
});