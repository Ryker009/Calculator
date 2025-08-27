const screen = document.getElementById('screen');
const keys = document.querySelector('.calculator-keys');

let currentString = '';
let hasCalculated = false;

keys.addEventListener('click', (event) => {
    if (!event.target.matches('button')) return;

    const key = event.target;
    const action = key.dataset.action;
    const value = key.dataset.value;

    // --- LOGIC FIX STARTS HERE ---
    // By using an if...else if structure, we ensure only one block runs per click.

    if (!action) {
        // This block now ONLY handles numbers and the decimal point.
        if (hasCalculated) {
            currentString = '';
            hasCalculated = false;
        }
        if (value === '.' && currentString.includes('.')) return;
        if (value === '0' && currentString === '0') return;

        currentString += value;
    } 
    
    else if (value === '+' || value === '-' || value === '*' || value === '/' || value === '%') {
        // This block now ONLY handles operators.
        // Prevent adding an operator if the string is empty
        if (currentString === '' && value !== '-') return;
        
        // Logic to prevent multiple operators like '++' or '*+'
        const lastChar = currentString.slice(-1);
        if (['+', '-', '*', '/', '%'].includes(lastChar)) {
            // Replace the last operator with the new one
            currentString = currentString.slice(0, -1) + value;
        } else {
            currentString += value;
        }
        hasCalculated = false;
    } 
    
    else if (action === 'delete') {
        currentString = currentString.slice(0, -1);
        hasCalculated = false;
    } 
    
    else if (action === 'clear') {
        currentString = '';
        hasCalculated = false;
    } 
    
    else if (action === 'calculate') {
        calculate();
    }
    
    // --- LOGIC FIX ENDS HERE ---

    updateScreen();
});

function updateScreen() {
    screen.textContent = currentString === '' ? '0' : currentString;
}

function calculate() {
    if (currentString === '' || ['+', '-', '*', '/', '%'].includes(currentString.slice(-1))) {
        // Don't calculate if the string is empty or ends with an operator
        return;
    }

    try {
        let expression = currentString.replace(/×/g, '*').replace(/÷/g, '/');
        const result = new Function('return ' + expression)();
        
        if (!isFinite(result)) {
            throw new Error("Cannot divide by zero");
        }

        // Round to a reasonable number of decimal places to avoid floating point issues
        currentString = String(parseFloat(result.toFixed(10)));
        hasCalculated = true;
        
        screen.classList.add('screen-result-animation');
        setTimeout(() => screen.classList.remove('screen-result-animation'), 300);

    } catch (error) {
        currentString = 'Error';
        hasCalculated = true;
    }
}

// --- BONUS: Keyboard Support ---
document.addEventListener('keydown', (event) => {
    // We prevent the default action for keys like '/' which can trigger a browser search
    if (['/', '*', 'Enter'].includes(event.key)) {
        event.preventDefault();
    }
    
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '.': '.',
        '+': '+', '-': '-', '*': '*', '/': '/', '%': '%',
        'Enter': 'calculate', '=': 'calculate',
        'Backspace': 'delete',
        'c': 'clear', 'C': 'clear', 'Escape': 'clear'
    };

    const action = keyMap[event.key];
    if (action) {
        let selector;
        if (['calculate', 'delete', 'clear'].includes(action)) {
            selector = `[data-action='${action}']`;
        } else {
            // Need to handle '*' key which corresponds to '×' button
            const buttonValue = event.key === '*' ? '×' : event.key;
            selector = `[data-value='${buttonValue}']`;
        }
        
        const button = document.querySelector(selector);
        if (button) {
            button.click();
            button.classList.add('active'); // Add a class for visual feedback
            setTimeout(() => button.classList.remove('active'), 100);
        }
    }
});

// Initialize the screen on load
updateScreen();