// ---- VARIABLES ----

let numberButtons = document.querySelectorAll('.btn.number');
let operationButtons = document.querySelectorAll('.btn.operation');
let clearButton = document.querySelector('.clear');
let deleteButton = document.querySelector('.delete');
let signButton = document.querySelector('.sign');

let displayContainer = document.getElementById('display-below');
let display = document.getElementById('display-result');

let arrowLeft = document.getElementById('arrow-left');
let arrowRight = document.getElementById('arrow-right');

let leftButton = document.querySelector('.move-left');
let rightButton = document.querySelector('.move-right');

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

function exp(a, b){
    return a ** b;
}

function root(a, b){
    if (a === 0 || (a%2 === 0 && b<0)) {
        resetCalc();
        return 'Err'
    }
    return b ** (1/a);
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
    moveDisplay()
}

function resetCalc() {
    display.textContent = '0';
    currentOperation = null;
    currentResult = null;
    clearDisplay = true;
    moveDisplay();
}

function addDigitToDisplay(digit) {
    if (digit === '.' && display.textContent.includes('.') && !clearDisplay) return
    if (clearDisplay) display.textContent = '';
    display.textContent += digit;
    clearDisplay = false;
    moveDisplay();
}

function compute(action) {
    if (clearDisplay) {
        currentOperation = action;
        return;
    }
    if (currentResult) {
        currentResult = operate(eval(currentOperation), parseFloat(currentResult), parseFloat(display.textContent));
        display.textContent = currentResult;
    } else {
        currentResult = display.textContent; 
    }
    clearDisplay = true
    currentOperation = action === 'equals' ? null: action;
    moveDisplay()
}

function moveDisplay(action) {

    const displayLeft = display.getBoundingClientRect().x
    const displayContainerLeft = displayContainer.getBoundingClientRect().x
    const displayRight = displayLeft + display.getBoundingClientRect().width
    const displayContainerRight = displayContainerLeft + displayContainer.getBoundingClientRect().width
    let right = parseFloat(getComputedStyle(display).right.substring(0,getComputedStyle(display).right.length-2))

    if (displayLeft < displayContainerLeft) {
        arrowLeft.classList.remove("hidden")
    } else {
        arrowLeft.classList.add("hidden")
    }
    if (displayRight > displayContainerRight){
        arrowRight.classList.remove("hidden")
    } else {
        arrowRight.classList.add("hidden")
    }

    if (!action) {
        display.style.right = '0px';
        return
    }
    
    if (action === 'left' && displayLeft < displayContainerLeft) {
        display.style.right = right - 15 + 'px'
    } else if (action === 'right' && displayRight > displayContainerRight)  {
        display.style.right = right + 15 + 'px'
    }
}

// ---- EVENT LISTENERS ----

signButton.addEventListener('click', changeSign)

clearButton.addEventListener('click', resetCalc)

deleteButton.addEventListener('click', deleteLastDigit)

numberButtons.forEach((element) => element.addEventListener('click',(e) => addDigitToDisplay(e.target.textContent)))

operationButtons.forEach((element) => element.addEventListener('click',(e) => compute(e.target.getAttribute('value'))))

leftButton.addEventListener('click', (e) => moveDisplay(e.target.getAttribute('value')))
rightButton.addEventListener('click', (e) => moveDisplay(e.target.getAttribute('value')))


