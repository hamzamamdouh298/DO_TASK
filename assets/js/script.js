'use strict';

// Select all DOM elements
const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = {};
let taskRemover = {};

// Store current date from built-in date object
const date = new Date();

// Import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");

// Import task delete sound
const taskDeleteSound = new Audio("./assets/sounds/mixkit-arrow-whoosh-1491.wav");

/**
 * Convert weekday number to weekday name
 * @param {number} dayNumber - Day number (0-6)
 * @returns {string} Weekday name
 */
const getWeekDayName = function (dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Not a valid day";
  }
};

/**
 * Convert month number to month name
 * @param {number} monthNumber - Month number (0-11)
 * @returns {string} Month name
 */
const getMonthName = function (monthNumber) {
  switch (monthNumber) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Not a valid month";
  }
};

// Store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// Update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;

/**
 * Toggle active class on element
 * @param {object} elem - Element node
 */
const elemToggler = function (elem) {
  elem.classList.toggle("active");
};

/**
 * Toggle active class on multiple elements
 * @param {object[]} elems - Array of element nodes
 * @param {function} event - Event handler function
 */
const addEventOnMultiElem = function (elems, event) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", event);
  }
};

/**
 * Create taskItem element node and return it
 * @param {string} taskText - Task text
 * @returns {object} taskItemElement
 */
const taskItemNode = function (taskText) {
  const createTaskItem = document.createElement("li");
  createTaskItem.classList.add("task-item");
  createTaskItem.setAttribute("data-task-item", "");

  createTaskItem.innerHTML = `
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>

    <p class="item-text">${taskText}</p>

    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
  `;

  return createTaskItem;
};

/**
 * Task input validation
 * @param {string} taskIsValid - Task input value
 */
const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {
    // If there is an existing task, the new task will be added before it
    if (taskList.childElementCount > 0) {
      taskList.insertBefore(taskItemNode(taskInput.value), taskItem[0]);
    } else {
      taskList.appendChild(taskItemNode(taskInput.value));
    }

    // After adding task on taskList, input field should be empty
    taskInput.value = "";

    // Hide the welcome note
    welcomeNote.classList.add("hide");

    // Update taskItem DOM selection
    taskItem = document.querySelectorAll("[data-task-item]");
    taskRemover = document.querySelectorAll("[data-task-remove]");
  } else {
    // If user pass any falsy value like(0, "", undefined, null, NaN)
    console.log("Please write something!");
  }
};

/**
 * If there is an existing task, the welcome note will be hidden
 */
const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    welcomeNote.classList.add("hide");
  } else {
    welcomeNote.classList.remove("hide");
  }
};

/**
 * Remove task when click on delete button or check button
 */
const removeTask = function () {
  // Select clicked taskItem
  const parentElement = this.parentElement;

  // If the task is completed, the taskItem would be removed after 250ms
  // If deleted than taskItem is removed instantly
  if (this.dataset.taskRemove === "complete") {
    parentElement.classList.add("complete"); // Add "complete" class on taskItem
    taskCompleteSound.play(); // Play taskCompleteSound

    setTimeout(function () {
      parentElement.remove(); // Remove taskItem
      removeWelcomeNote(); // Remove welcome note
      taskDeleteSound.play(); // Play task delete sound
    }, 250);
  } else {
    parentElement.remove(); // Remove taskItem
    removeWelcomeNote(); // Remove welcome note
    taskDeleteSound.play(); // Play task delete sound
  }
};

/**
 * Add task function
 */
const addTask = function () {
  // Check the task input validation
  taskInputValidation(taskInput.value);

  // Add event listeners to all taskItem checkbox and delete buttons
  addEventOnMultiElem(taskRemover, removeTask);
};

/**
 * Add keypress listener on taskInput
 */
taskInput.addEventListener("keypress", function (e) {
  // Add task if user presses 'Enter'
  switch (e.key) {
    case "Enter":
      addTask();
      break;
  }
});

// Toggle active class on menu when click on menuBtn or dropdownLink
const toggleMenu = function () {
  elemToggler(menu);
};
addEventOnMultiElem(menuTogglers, toggleMenu);

// Toggle active class on modal when click on dropdownLink or modal Ok button
const toggleModal = function () {
  elemToggler(modal);
};
addEventOnMultiElem(modalTogglers, toggleModal);

/**
 * Add "loaded" class on body when website is fully loaded
 */
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});