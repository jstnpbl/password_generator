/**
 * Password Generator Module
 * @module PasswordGenerator
 */
const PasswordGenerator = (function () {
    // DOM Elements
    const elements = {
        passwordOutput: document.getElementById('password-output'),
        lengthSlider: document.getElementById('length-slider'),
        lengthValue: document.getElementById('length-value'),
        uppercaseCheck: document.getElementById('uppercase-check'),
        lowercaseCheck: document.getElementById('lowercase-check'),
        numbersCheck: document.getElementById('numbers-check'),
        symbolsCheck: document.getElementById('symbols-check'),
        customSymbols: document.getElementById('custom-symbols'),
        excludeSimilarCheck: document.getElementById('exclude-similar-check'),
        customSymbolsContainer: document.getElementById('custom-symbols-container'),
        errorMessage: document.getElementById('error-message'),
        generateBtn: document.getElementById('generate-btn'),
        copyBtn: document.getElementById('copy-btn'),
        strengthText: document.getElementById('strength-text'),
        strengthBars: document.getElementById('strength-bars'),
        notification: document.getElementById('notification'),
        historyToggle: document.getElementById('history-toggle'),
        historyList: document.getElementById('history-list')
    };

    // Character Sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        similar: 'l1IO0'
    };

    // Password History
    const MAX_HISTORY = 5;
    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

    /**
     * Initializes event listeners and UI
     */
    function init() {
        elements.lengthSlider.addEventListener('input', () => {
            elements.lengthValue.textContent = elements.lengthSlider.value;
            elements.lengthSlider.setAttribute('aria-valuenow', elements.lengthSlider.value);
            updateStrengthMeter();
        });

        ['uppercase', 'lowercase', 'numbers', 'symbols', 'excludeSimilar'].forEach(type => {
            elements[`${type}Check`].addEventListener('change', updateStrengthMeter);
        });

        elements.symbolsCheck.addEventListener('change', () => {
            elements.customSymbolsContainer.hidden = !elements.symbolsCheck.checked;
            updateStrengthMeter();
        });

        elements.customSymbols.addEventListener('input', updateStrengthMeter);
        elements.generateBtn.addEventListener('click', generatePassword);
        elements.copyBtn.addEventListener('click', copyToClipboard);
        elements.historyToggle.addEventListener('click', toggleHistory);
        updateStrengthMeter();
        renderHistory();
        generatePassword();
    }

    /**
     * Generates a random password
     */
    function generatePassword() {
        const length = parseInt(elements.lengthSlider.value);
        let symbols = elements.symbolsCheck.checked && elements.customSymbols.value
            ? elements.customSymbols.value
            : charSets.symbols;

        // Validate inputs
        if (elements.symbolsCheck.checked && !symbols) {
            showError('Please enter at least one symbol or uncheck Symbols.');
            return;
        }

        if (!elements.uppercaseCheck.checked && !elements.lowercaseCheck.checked &&
            !elements.numbersCheck.checked && !elements.symbolsCheck.checked) {
            showError('Please select at least one character type.');
            elements.passwordOutput.textContent = 'Please select at least one option';
            return;
        }

        clearError();

        // Build character pool
        let charPool = '';
        if (elements.uppercaseCheck.checked) charPool += charSets.uppercase;
        if (elements.lowercaseCheck.checked) charPool += charSets.lowercase;
        if (elements.numbersCheck.checked) charPool += charSets.numbers;
        if (elements.symbolsCheck.checked) charPool += symbols;

        if (elements.excludeSimilarCheck.checked) {
            charPool = charPool.split('').filter(char => !charSets.similar.includes(char)).join('');
        }

        // Generate password
        let password = '';
        const checks = [
            { check: elements.uppercaseCheck, chars: charSets.uppercase },
            { check: elements.lowercaseCheck, chars: charSets.lowercase },
            { check: elements.numbersCheck, chars: charSets.numbers },
            { check: elements.symbolsCheck, chars: symbols }
        ];

        checks.forEach(({ check, chars }) => {
            if (check.checked) {
                let availableChars = elements.excludeSimilarCheck.checked
                    ? chars.split('').filter(char => !charSets.similar.includes(char)).join('')
                    : chars;
                if (availableChars) {
                    password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
                }
            }
        });

        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool.charAt(randomIndex);
        }

        password = shuffleString(password);
        elements.passwordOutput.textContent = password;
        updateStrengthMeter(password);
        saveToHistory(password);
    }

    /**
     * Shuffles a string using Fisher-Yates
     * @param {string} str - String to shuffle
     * @returns {string} Shuffled string
     */
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    /**
     * Calculates password strength using entropy
     * @param {string} [password] - Current password
     */
    function updateStrengthMeter(password = null) {
        let poolSize = 0;
        if (elements.uppercaseCheck.checked) poolSize += charSets.uppercase.length;
        if (elements.lowercaseCheck.checked) poolSize += charSets.lowercase.length;
        if (elements.numbersCheck.checked) poolSize += charSets.numbers.length;
        if (elements.symbolsCheck.checked) {
            const symbols = elements.customSymbols.value || charSets.symbols;
            poolSize += new Set(symbols).size;
        }
        if (elements.excludeSimilarCheck.checked) {
            let similarCount = 0;
            const similar = charSets.similar.split('');
            if (elements.lowercaseCheck.checked) similarCount += similar.includes('l') ? 1 : 0;
            if (elements.uppercaseCheck.checked) similarCount += similar.includes('I') ? 1 : 0;
            if (elements.numbersCheck.checked) similarCount += (similar.includes('1') ? 1 : 0) + (similar.includes('0') ? 1 : 0);
            if (elements.uppercaseCheck.checked || elements.lowercaseCheck.checked) similarCount += similar.includes('O') ? 1 : 0;
            poolSize = Math.max(poolSize - similarCount, 0);
        }
        const length = parseInt(elements.lengthSlider.value);
        const entropy = length * (poolSize > 0 ? Math.log2(poolSize) : 0);
        console.log(`Entropy: ${entropy}, Pool Size: ${poolSize}, Length: ${length}`);

        const strengthLevels = [
            { threshold: 0, text: 'Weak', class: 'weak', bars: 1 },
            { threshold: 40, text: 'Fair', class: 'weak', bars: 2 },
            { threshold: 60, text: 'Good', class: 'medium', bars: 3 },
            { threshold: 80, text: 'Strong', class: 'strong', bars: 4 }
        ];

        // Select the highest matching level
        const level = strengthLevels.reduce((selected, lvl) => {
            return entropy >= lvl.threshold ? lvl : selected;
        }, strengthLevels[0]);
        console.log(`Selected Level: ${level.text}, Bars: ${level.bars}`); // Debug

        elements.strengthText.textContent = level.text;
        elements.strengthBars.className = `strength-bars ${level.class}`;

        const bars = elements.strengthBars.querySelectorAll('.strength-bar');
        if (bars.length === 0) {
            console.error('No strength bars found in DOM');
            return;
        }
        bars.forEach((bar, index) => {
            // Clear existing classes and apply bar-active if needed
            bar.classList.remove('bar-active');
            if (index < level.bars) {
                bar.classList.add('bar-active');
            }
        });
    }

    /**
     * Copies password to clipboard
     */
    function copyToClipboard() {
        const password = elements.passwordOutput.textContent;
        if (password === 'Your password will appear here' || password === 'Please select at least one option') {
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            showNotification();
        }).catch(err => {
            console.error('Failed to copy password:', err);
        });
    }

    /**
     * Shows notification
     */
    function showNotification() {
        elements.notification.classList.add('show');
        setTimeout(() => {
            elements.notification.classList.remove('show');
        }, 2000);
    }

    /**
     * Saves password to history
     * @param {string} password - Password to save
     */
    function saveToHistory(password) {
        if (password === 'Your password will appear here' || password === 'Please select at least one option') {
            return;
        }

        passwordHistory.unshift({
            password,
            timestamp: new Date().toLocaleString()
        });

        if (passwordHistory.length > MAX_HISTORY) {
            passwordHistory.pop();
        }

        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
        renderHistory();
    }

    /**
     * Renders password history
     */
    function renderHistory() {
        elements.historyList.innerHTML = '';
        if (passwordHistory.length === 0) {
            elements.historyList.innerHTML = '<p>No history available.</p>';
            return;
        }

        passwordHistory.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span class="history-password">${item.password}</span>
                <span class="history-timestamp">${item.timestamp}</span>
                <button class="history-copy" data-index="${index}">Copy</button>
            `;
            elements.historyList.appendChild(div);
        });

        const clearBtn = document.createElement('button');
        clearBtn.className = 'history-clear';
        clearBtn.textContent = 'Clear History';
        clearBtn.addEventListener('click', () => {
            passwordHistory = [];
            localStorage.removeItem('passwordHistory');
            renderHistory();
        });
        elements.historyList.appendChild(clearBtn);

        elements.historyList.querySelectorAll('.history-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                navigator.clipboard.writeText(passwordHistory[index].password).then(() => {
                    showNotification();
                });
            });
        });
    }

    /**
     * Toggles history visibility
     */
    function toggleHistory() {
        const isHidden = elements.historyList.hidden;
        elements.historyList.hidden = !isHidden;
        elements.historyToggle.setAttribute('aria-expanded', isHidden);
        elements.historyToggle.textContent = isHidden ? 'Hide Password History' : 'Show Password History';
    }

    /**
     * Shows error message
     * @param {string} message - Error message
     */
    function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.hidden = false;
        elements.passwordOutput.textContent = 'Error generating password';
    }

    /**
     * Clears error message
     */
    function clearError() {
        elements.errorMessage.textContent = '';
        elements.errorMessage.hidden = true;
    }

    // Public API
    return {
        init
    };
})();

// Initialize
PasswordGenerator.init();