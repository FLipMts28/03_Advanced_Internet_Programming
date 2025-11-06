import { CanvasDrawer } from './CanvasDrawer.js';
import { Task } from './Task.js';

const canvas = document.getElementById('displayed-canvas');
const drawer = new CanvasDrawer(canvas);

const todo = document.getElementById('todo-column');
const inprogress = document.getElementById('inprogress-column');
const done = document.getElementById('done-column');
const dropzones = document.querySelectorAll('.dropzone');

// ---------------------------
//  TASK LOGIC
// ---------------------------

let tasks = [
  new Task(1, 'Learn about ES Modules', 'todo'),
  new Task(2, 'Style the Kanban board', 'inprogress'),
  new Task(3, 'Implement drag and drop', 'done'),
];

// ---- LocalStorage helpers ----
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    const parsed = JSON.parse(saved);
    tasks = parsed.map(t => new Task(t.id, t.text, t.status));
  }
}

// ---- Render tasks on the board ----
function renderTasks() {
  [todo, inprogress, done].forEach(col => {
    while (col.children.length > 1) col.removeChild(col.lastChild);
  });

  tasks.forEach(t => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.textContent = t.text;
    card.dataset.id = t.id;

    // attach dragstart event
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', t.id);
      console.log(`Dragging task ${t.id}: ${t.text}`);
    });

    if (t.status === 'todo') todo.appendChild(card);
    else if (t.status === 'inprogress') inprogress.appendChild(card);
    else if (t.status === 'done') done.appendChild(card);
  });
}

// ---- Handle dropping ----
function handleDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const task = tasks.find(t => t.id == id);
  const column = e.currentTarget;

  if (task) {
    if (column.id === 'todo-column') task.status = 'todo';
    else if (column.id === 'inprogress-column') task.status = 'inprogress';
    else if (column.id === 'done-column') task.status = 'done';
  }

  saveTasks();
  renderTasks();
}

// ---- Set up drop zones ----
dropzones.forEach(zone => {
  zone.addEventListener('dragover', e => e.preventDefault());
  zone.addEventListener('drop', handleDrop);
});

// ---- Add new tasks ----
const addTaskButton = document.getElementById('addTask');
addTaskButton.addEventListener('click', () => {
  const input = document.getElementById('inputTask');
  if (!input.value.trim()) return;

  const newTask = new Task(Date.now(), input.value, 'todo');
  tasks.push(newTask);
  input.value = '';

  saveTasks();
  renderTasks();
});

// ---------------------------
//  IMAGE DROP LOGIC
// ---------------------------

// Optional: wrap canvas in a drop zone
const canvasDropZone = document.getElementById('displayed-canvas') || canvas;

// Handle drag over
canvasDropZone.addEventListener('dragover', event => {
  event.preventDefault();
  canvasDropZone.classList.add('drag-over');
});

// Handle drag leave
canvasDropZone.addEventListener('dragleave', () => {
  canvasDropZone.classList.remove('drag-over');
});

// Handle drop (image load)
canvasDropZone.addEventListener('drop', event => {
  event.preventDefault();
  canvasDropZone.classList.remove('drag-over');

  const files = event.dataTransfer.files;

  // Make sure there's at least one file and it’s an image
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    const reader = new FileReader();

    // When the file is fully read
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result; // Base64 data URL

      // When the image is loaded
      img.onload = () => {
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scale image proportionally to fit canvas width
        const scale = canvas.width / img.width;
        const newHeight = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, newHeight);
      };
    };

    // Start reading the image file
    reader.readAsDataURL(files[0]);
  } else {
    alert('⚠️ Please drop an image file (PNG, JPG, etc.)');
  }
});

// ---- Initial load ----
loadTasks();
renderTasks();
