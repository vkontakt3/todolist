const btnFilter = document.querySelector('.btn-filter'); // Кнопка для показа/скрытия
const listFilters = document.querySelector('.list-filters'); // Список фильтров
const showTime = document.querySelector('#showTime'); // Список фильтров
const time = document.querySelector('.time'); // Список фильтров
const FilterNav = document.querySelector('.filters-wrapper'); // Список фильтров
const taskButtons = document.querySelectorAll(".task-item button");

btnFilter.addEventListener('click', () => {
    listFilters.classList.toggle('visible'); // Переключаем класс, который управляет видимостью
    
    if (listFilters.classList.contains('visible')) {
        FilterNav.classList.add('nav-active')
    }else {
        FilterNav.classList.remove('nav-active')
    }

});
    
showTime.addEventListener('click', () => {
    time.classList.toggle('time-active');
});

const taskList = document.querySelector('.tasks');
const inputTask = document.querySelector('#inputTask');
const sendBtn = document.querySelector('#sendBtn');
const timeInput = document.querySelector('.time-input');


function addTask() {
    const input = inputTask.value.trim();
    const getTime = timeInput.value.trim();
    

    if(input !== '') {
        let taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskInner = document.createElement('p');
        taskInner.classList.add('task-inner');
        taskInner.textContent = input;

        const taskTime = document.createElement('p');
        taskTime.textContent = getTime || 'No time';
        taskTime.style.width = '60px';

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'X'
        deleteBtn.classList.add('deleteBtn')

        taskItem.appendChild(taskInner);

        

        // Проверка времени
        if (/^\d{2}:\d{2}$/.test(getTime) && getTime !== '') {
            const parts = getTime.split(':');
            const hours = Number(parts[0]);
            const minutes = Number(parts[1]);
        
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                taskTime.textContent = getTime; // Время корректное
                taskItem.appendChild(taskTime);
            } else {
                taskTime.textContent = 'Invalid time'; // Неверное время
                taskItem.appendChild(taskTime);
            }
        } else {
            taskTime.textContent = 'No time'; // Неверный формат
            taskItem.appendChild(taskTime);
        }

        if (taskList.firstChild) {
            taskList.insertBefore(taskItem, taskList.firstChild);
        } else {
            taskList.appendChild(taskItem);
        }

        const taskBtnCompleted = document.createElement('button');
        const imgBtn = document.createElement('img');
        imgBtn.style.width = '30px';
        imgBtn.src = 'https://cdn.icon-icons.com/icons2/916/PNG/512/Checkmark_icon-icons.com_71846.png';

        taskBtnCompleted.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            // Сохраняем состояние в localStorage
            saveToLocalStorage();
        });

        taskBtnCompleted.appendChild(imgBtn);
        taskItem.appendChild(taskBtnCompleted);
        taskItem.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', () => {
            deleteTask(input, getTime)
            saveToLocalStorage()

            taskItem.remove()
        })

        // Сохраняем задачу в localStorage
        saveToLocalStorage(input, getTime, false);

        inputTask.value = '';
        timeInput.value = '';
    }
}

const btnAll = document.getElementById('btnAll')
const btnActive = document.getElementById('btnActive')
const btnCompleted = document.getElementById('btnCompleted')

function showFilter(filter) {
    const tasks = document.querySelectorAll('.task-item'); // Получаем все задачи
    tasks.forEach(task => {
        if (filter === 'all') {
            task.style.display = 'flex';
        } else if (filter === 'active' && !task.classList.contains('completed')) {
            task.style.display = 'flex';
        } else if (filter === 'completed' && task.classList.contains('completed')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}


btnAll.addEventListener('click', () => showFilter('all'))
btnActive.addEventListener('click', () => showFilter('active'))
btnCompleted.addEventListener('click', () => showFilter('completed'))



function saveToLocalStorage(task, time, completed) {
    let arrayTask = JSON.parse(localStorage.getItem('tasks')) || [];

    // Проверяем, существует ли задача
    const existingTaskIndex = arrayTask.findIndex(t => t.task === task && t.time === time);
    
    if (existingTaskIndex !== -1) {
        arrayTask[existingTaskIndex].completed = completed; // Обновляем статус
    } else if (task) { // Добавляем задачу, даже если время пустое
        arrayTask.push({task, time: time || '', completed});
    }

    // Проверяем, состоит ли массив только из пустых объектов
    const isArrayEmptyOrInvalid = arrayTask.every(
        t => !t.task && !t.time && typeof t.completed === 'undefined'
    );

    if (isArrayEmptyOrInvalid) {
        localStorage.removeItem('tasks'); // Удаляем ключ
    } else {
        localStorage.setItem('tasks', JSON.stringify(arrayTask)); // Сохраняем обновленный массив
    }
}





function loadTasksFromLocalStorage() {
    let arrayTask = JSON.parse(localStorage.getItem('tasks')) || [];
    arrayTask.forEach(({task, time, completed}) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskInner = document.createElement('p');
        taskInner.classList.add('task-inner');
        taskInner.textContent = task;

        taskItem.appendChild(taskInner);

        const taskTime = document.createElement('p');
        taskTime.textContent = time;
        taskTime.style.width = '60px';

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'X'
        deleteBtn.classList.add('deleteBtn')

        taskItem.appendChild(taskTime);

        if (/^\d{2}:\d{2}$/.test(time)) {
            const parts = time.split(':');
            const hours = Number(parts[0]);
            const minutes = Number(parts[1]);
        
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                taskTime.textContent = time; // Время корректное
                taskItem.appendChild(taskTime);
            } else {
                taskTime.textContent = 'Invalid time'; // Неверное время
                taskItem.appendChild(taskTime);
            }
        } else {
            taskTime.textContent = 'No time'; // Неверный формат
            taskItem.appendChild(taskTime);
        }

        const taskBtnCompleted = document.createElement('button');
        const imgBtn = document.createElement('img');
        imgBtn.style.width = '30px';
        imgBtn.src = 'https://cdn.icon-icons.com/icons2/916/PNG/512/Checkmark_icon-icons.com_71846.png';

        taskBtnCompleted.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveToLocalStorage(task, time, taskItem.classList.contains('completed')); // Обновляем состояние
        });

        taskBtnCompleted.appendChild(imgBtn);
        taskItem.appendChild(taskBtnCompleted);
        taskItem.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', () => {
            deleteTask(task, time)
            saveToLocalStorage()

            taskItem.remove()
        })

        // Восстанавливаем состояние задачи
        if (completed) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }

        if (taskList.firstChild) {
            taskList.insertBefore(taskItem, taskList.firstChild);
        } else {
            taskList.appendChild(taskItem);
        }
    });
}

function deleteTask(taskToDelte, timeToTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let updatedTasks = tasks.filter(task => !(task.task === taskToDelte && task.time === timeToTask));

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

const nameUsers = document.getElementById('name-users')
const inputName = document.querySelector('.input-name')

function getName() {
    const nameValue = inputName.value.trim()

    if(nameValue !== '') {
        nameUsers.textContent = nameValue
    }else {
        nameUsers.textContent = 'No name'
    }
    inputName.value = ''
    getNameLS(nameValue)
}

function getNameLS(name) {
    const names = JSON.parse(localStorage.getItem('name')) || []
    names.push(name)
    localStorage.setItem('name', JSON.stringify(names))
    
}

function loadNameLS() {
    const names = JSON.parse(localStorage.getItem('name')) || []
    if (names.length > 0) {
        nameUsers.textContent = names[names.length -1] // Берём последнее сохранённое имя
    } else {
        nameUsers.textContent = 'No name' // Если нет сохранённых имён
    }
}


const navTask = document.querySelector('.item-navigation-tasks')
const navSettings = document.querySelector('.item-navigation-settings')
const todoSection = document.querySelector('.todo')
const settingsSection = document.querySelector('.settings')
const tasksText = document.querySelector('.tasks-text')
const settingsText = document.querySelector('.settings-text')

navTask.addEventListener('click', () => {
    todoSection.style.display = 'block'
    settingsSection.style.display = 'none'
    navTask.classList.add('nav-active')
    navSettings.classList.remove('nav-active')
})
navSettings.addEventListener('click', () => {
    todoSection.style.display = 'none'
    settingsSection.style.display = 'block'
    navTask.classList.remove('nav-active')
    navSettings.classList.add('nav-active')
})


document.getElementById('saveName').addEventListener('click', getName)
inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getName();
    }
});
inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        inputName.blur(); // Убирает фокус с поля ввода
    }
});



window.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage() 
    showFilter('all')
    loadNameLS()
})


sendBtn.addEventListener('click', addTask)
    
inputTask.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

timeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

