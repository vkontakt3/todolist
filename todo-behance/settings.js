
// Элементы для управления темой
const themeSwitch = document.getElementById('themeSwitch');
const body = document.documentElement;

// Сохраняем и восстанавливаем тему
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeSwitch.checked = savedTheme === 'dark';

// Логика переключения темы
themeSwitch.addEventListener('change', () => {
    const newTheme = themeSwitch.checked ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const clearAllTasksButton = document.getElementById('resetTasks');

function clearAllTasks() {
    taskList.innerHTML = '';

    localStorage.removeItem('tasks'); 
}

clearAllTasksButton.addEventListener('click', clearAllTasks);


import { languageData } from './language.js';  // Импортируем переводы

const langButton = document.getElementById('changeLang');

langButton.addEventListener('click', () => {
    let currentLang = document.documentElement.lang || 'en'; // Получаем текущий язык
    let newLang = currentLang === 'en' ? 'ru' : 'en'; // Переключаем на противоположный язык
    document.documentElement.lang = newLang; // Меняем язык

    // Обновляем текст на странице
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const langKey = element.getAttribute('data-lang');
        element.textContent = languageData[newLang][langKey] || element.textContent;
    });
});



class Calculator {
    /** 
     * @param {number} value
     */
    constructor(value) {
        this.result = value; // Инициализация начального значения
    }
    
    /** 
     * @param {number} value
     * @return {Calculator}
     */
    add(value) {
        this.result += value; // Обновляем значение
        return this; // Возвращаем текущий объект для цепочки вызовов
    }
    
    /** 
     * @param {number} value
     * @return {Calculator}
     */
    subtract(value) {
        this.result -= value;
        return this;
    }
    
    /** 
     * @param {number} value
     * @return {Calculator}
     */  
    multiply(value) {
        this.result *= value;
        return this;
    }
    
    /** 
     * @param {number} value
     * @return {Calculator}
     */
    divide(value) {
        if (value !== 0) { // Проверяем деление на ноль
            this.result /= value;
        } else {
            console.warn("Division by zero is not allowed");
        }
        return this;
    }
    
    /** 
     * @param {number} value
     * @return {Calculator}
     */
    power(value) {
        this.result **= value;
        return this;
    }
    
    /** 
     * @return {number}
     */
    getResult() {
        return this.result; // Возвращаем текущее значение результата
    }
}
const calc = new Calculator(10);
calc.divide(0); // Должно вывести предупреждение в консоль
