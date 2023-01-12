// ---- VARIABLES ----

let numberButtons = document.querySelectorAll('.btn.number');
let operationButtons = document.querySelectorAll('.btn.operation');
let display = document.getElementById('display');
let clearButton = document.querySelector('.clear');
let deleteButton = document.querySelector('.delete');
let signButton = document.querySelector('.sign');

let currentResult = null
let currentOperation = null
let clearDisplay = true


// ---- FUNCTIONS ----

function add (a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if (b === 0) {
        resetCalc();
        return 'Err'
    }
    return a / b;
}

function operate(op, a, b) {
    return op(a, b);
}

function changeSign() {
    if (display.textContent[0] === '-') {
        display.textContent = display.textContent.substring(1)
    } else {
        display.textContent = '-' + display.textContent
    }
}

function deleteLastDigit() {
    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.substring(0,display.textContent.length - 1);
    }
}

function resetCalc() {
    display.textContent = '0';
    currentOperation = null;
    currentResult = null;
    clearDisplay = true;
}

function addDigitToDisplay(digit) {
    if (digit === '.' && display.textContent.includes('.')) return
    if (clearDisplay) display.textContent = '';
    display.textContent += digit;
    clearDisplay = false;
}

function compute(action) {
    if (currentResult) {
        currentResult = operate(eval(currentOperation), parseFloat(currentResult), parseFloat(display.textContent));
        display.textContent = currentResult;
    } else {
        currentResult = display.textContent; 
    }
    clearDisplay = true
    currentOperation = action;
}

// ---- EVENT LISTENERS ----

signButton.addEventListener('click', changeSign)

clearButton.addEventListener('click', resetCalc)

deleteButton.addEventListener('click', deleteLastDigit)

numberButtons.forEach((element) => element.addEventListener('click',(e) => addDigitToDisplay(e.target.textContent)))

operationButtons.forEach((element) => element.addEventListener('click',(e) => compute(e.target.getAttribute('value'))))



