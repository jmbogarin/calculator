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

function moveDisplay(direction) {

    let dim = {
        get displayLeft() {return display.getBoundingClientRect().x},
        get displayContainerLeft() {return displayContainer.getBoundingClientRect().x},
        get displayWidth() {return display.getBoundingClientRect().width},
        get displayContainerWidth() {return displayContainer.getBoundingClientRect().width},
        get displayRight() {return dim.displayLeft + dim.displayWidth},
        get displayContainerRight() {return dim.displayContainerLeft + dim.displayContainerWidth},
        get right() {return parseFloat(getComputedStyle(display).right.substring(0,getComputedStyle(display).right.length-2))}
    }

    if (!direction) {
        if (clearDisplay && dim.displayWidth > dim.displayContainerWidth) {
            display.style.right = dim.right - (dim.displayWidth - dim.displayContainerWidth) + 'px';
        } else {
            display.style.right = '0px';
        }
    } else if (direction === 'ArrowLeft' && dim.displayLeft < dim.displayContainerLeft) {
        display.style.right = dim.right - 15 + 'px';
    } else if (direction === 'ArrowRight' && dim.displayRight > dim.displayContainerRight)  {
        display.style.right = dim.right + 15 + 'px';
    }

    if (dim.displayLeft < dim.displayContainerLeft) {
        arrowLeft.classList.remove("hidden")
    } else {
        arrowLeft.classList.add("hidden")
    }
    if (dim.displayRight > dim.displayContainerRight){
        arrowRight.classList.remove("hidden")
    } else {
        arrowRight.classList.add("hidden")
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

window.addEventListener('keydown', (e) => {
    e.preventDefault()
    if (['1','2','3','4','5','6','7','8','9','0','.'].includes(e.key)) {
        addDigitToDisplay(e.key);
    } else if (['+','-','*','/','Enter','=','^'].includes(e.key)) {
        const opDict = {
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide',
            'Enter': 'equals',
            '=': 'equals',
            '^': 'exp'
        }
        compute(opDict[e.key]);
    } else if (e.key === 'Backspace') {
        deleteLastDigit();
    } else if (e.key === 'Escape') {
        resetCalc();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        moveDisplay(e.key)
    }
})
