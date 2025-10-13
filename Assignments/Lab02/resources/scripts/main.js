import { CanvasDrawer } from './CanvasDrawer.js';
import { Task         } from './Task.js';
//import { loadTasks    } from './Task.js';
//import { saveTasks    } from './Task.js';
//import { renderTasks  } from './Task.js';   

const canvas = document.getElementById('displayed-canvas');
const drawer = new CanvasDrawer(canvas);

const todo = document.getElementById('todo-column');
const inprogress = document.getElementById('inprogress-column');
const done = document.getElementById('done-column');

let tasks =[
    new Task (1, 'Learn about ES Modules','todo'),
    new Task (2, 'Style the Kanban board', 'inprogress'),
    new Task (3, 'Implement drag and drop', 'done'),
];

function loadTasks() {
    const saved = localStorage.getItem('tasks');

    if(saved) {
        const tasksTemp = JSON.parse(saved);
        tasks = tasksTemp.map(t => new Task(t.id, t.text, t.status, t.location));
    }
}

loadTasks();
renderTasks();

function toJSON(json) {
    return JSON.stringify(json);
}

function fromJSON(json) {
    const arr = JSON.parse(json);
}

function renderTasks() {
    [todo, inprogress, done].forEach(c => {
        while(c.children.length > 1) {
            c.removeChild(c.lastChild);
        }
    });
 
    };

    tasks.forEach(t => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('card');
        taskDiv.draggable = true;
        taskDiv.textContent = t.text;

        if(t.status === 'todo') {
            todo.appendChild(taskDiv);
        } else if (t.status == 'inprogress') {
            inprogress.appendChild(taskDiv);
        } else if ( t.status == 'done') {
            done.appendChild(taskDiv);
        }
    });

    const dragables = document.querySelectorAll(".card")
    
    dragables.forEach(card => {
        card.addEventListener("dragstart", function() {
            this.classList.add("dragging")
        })
    
        card.addEventListener("dragend", function(){
            this.classList.remove("dragging");
        })
    
    const zones = document.querySelectorAll(".column")
    zones.forEach (column => {
        column.addEventListener("dragover", function(){
            const draggedElement = document.querySelectorAll(".card")
            this.appendChild(draggedElement);
            })
        })
    })

    const addTaskButton = document.getElementById('addTask');

    addTaskButton.addEventListener('click', () => {
    const input = document.getElementById('inputTask');

    const t = new Task(Date.now(), input.value, 'todo');
    tasks.push(t);
        
    input.value = '';

    localStorage.setItem('tasks', toJSON(tasks));
    renderTasks();


});

loadTasks();