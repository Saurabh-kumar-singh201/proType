// UI Controller

export class UI {
    constructor() {
        // Typing elements
        this.typingText = document.getElementById('typing-text');
        this.typingContainer = document.getElementById('typing-container');
        
        // Stat displays
        this.wpmDisplay = document.getElementById('wpm-display');
        this.accuracyDisplay = document.getElementById('accuracy-display');
        this.timeDisplay = document.getElementById('time-display');
        this.charsDisplay = document.getElementById('chars-display');
        this.progressFill = document.getElementById('progress-fill');
        this.timerPanel = document.querySelector('.timer-panel');
        
        // Results panel elements
        this.resultsPanel = document.getElementById('results-panel');
        this.finalWpm = document.getElementById('final-wpm');
        this.finalAccuracy = document.getElementById('final-accuracy');
        this.finalChars = document.getElementById('final-chars');
        this.finalErrors = document.getElementById('final-errors');
        
        // Messages
        this.restartMessage = document.getElementById('restart-message');
    }

    renderText(text) {
        this.typingText.innerHTML = text.split('').map((char, index) => {
            const className = index === 0 ? 'char current' : 'char';
            const displayChar = char === ' ' ? ' ' : char;
            return `<span class="${className}">${displayChar}</span>`;
        }).join('');
        this.typingContainer.scrollTop = 0;
    }

    updateCharacterState(index, isCorrect) {
        const chars = this.typingText.querySelectorAll('.char');
        if (index >= chars.length) return;

        const currentChar = chars[index];
        currentChar.classList.remove('current');
        
        if (isCorrect) {
            currentChar.classList.add('correct');
            currentChar.classList.remove('incorrect');
        } else {
            currentChar.classList.add('incorrect');
            currentChar.classList.remove('correct');
        }

        // Update current position
        if (index + 1 < chars.length) {
            chars[index + 1].classList.add('current');
            this.ensureCursorInView(chars[index + 1]);
        }
    }

    updateCurrentPosition(index) {
        const chars = this.typingText.querySelectorAll('.char');
        chars.forEach((char, i) => {
            if (i === index) {
                char.classList.add('current');
            } else {
                char.classList.remove('current');
            }
        });
    }

    removeCharacterState(index) {
        const chars = this.typingText.querySelectorAll('.char');
        if (index >= chars.length) return;

        chars[index].classList.remove('correct', 'incorrect', 'current');
        chars[index].classList.add('current');
        
        if (index + 1 < chars.length) {
            chars[index + 1].classList.remove('current');
        }

        this.ensureCursorInView(chars[index]);
    }

    updateStats(wpm, accuracy, time, chars) {
        if (this.wpmDisplay) this.wpmDisplay.textContent = wpm;
        if (this.accuracyDisplay) this.accuracyDisplay.textContent = accuracy;
        if (this.timeDisplay) this.timeDisplay.textContent = time;
        if (this.charsDisplay) this.charsDisplay.textContent = chars;
    }

    updateProgress(percentage) {
        if (!this.progressFill) return;
        this.progressFill.style.width = `${Math.min(100, percentage)}%`;
    }

    setActiveState(isActive) {
        if (isActive) {
            this.typingContainer.classList.add('active');
            this.restartMessage.classList.add('visible');
            document.body.classList.add('focus-mode');
        } else {
            this.typingContainer.classList.remove('active');
            this.restartMessage.classList.remove('visible');
            document.body.classList.remove('focus-mode');
            const activeChars = this.typingText.querySelectorAll('.char.current');
            activeChars.forEach(char => char.classList.remove('current'));
        }
    }

    setTimerVisible(isVisible) {
        if (!this.timerPanel) return;
        this.timerPanel.style.display = isVisible ? '' : 'none';
    }

    ensureCursorInView(targetChar) {
        if (!targetChar) return;
        const lineHeight = parseFloat(getComputedStyle(this.typingText).lineHeight) || 0;
        const containerTop = this.typingContainer.scrollTop;
        const containerHeight = this.typingContainer.clientHeight;
        const charTop = targetChar.offsetTop;
        const charBottom = charTop + lineHeight;

        if (charBottom - containerTop > containerHeight - lineHeight) {
            this.typingContainer.scrollTop = charTop - lineHeight * 2;
        } else if (charTop < containerTop + lineHeight) {
            this.typingContainer.scrollTop = Math.max(0, charTop - lineHeight);
        }
    }

    showResults(wpm, accuracy, chars, errors) {
        this.finalWpm.textContent = wpm;
        this.finalAccuracy.textContent = accuracy + '%';
        this.finalChars.textContent = chars;
        this.finalErrors.textContent = errors;
        this.resultsPanel.classList.add('active');
        this.restartMessage.classList.add('visible');
    }

    hideResults() {
        this.resultsPanel.classList.remove('active');
        this.restartMessage.classList.remove('visible');
    }

    resetDisplay(timeLimit) {
        if (this.wpmDisplay) this.wpmDisplay.textContent = '0';
        if (this.accuracyDisplay) this.accuracyDisplay.textContent = '100';
        if (this.timeDisplay) this.timeDisplay.textContent = timeLimit;
        if (this.charsDisplay) this.charsDisplay.textContent = '0';
        if (this.progressFill) {
            this.progressFill.style.width = '0%';
        }
        this.setActiveState(false);
    }

    updateSettingsVisibility(mode) {
        const timeSettings = document.querySelector('.time-settings');
        const wordSettings = document.querySelector('.word-settings');
        
        timeSettings.style.display = mode === 'time' ? 'inline-flex' : 'none';
        wordSettings.style.display = mode === 'words' ? 'inline-flex' : 'none';
    }

    highlightActiveButton(selector, value) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
            const dataValue = btn.dataset.mode || btn.dataset.time || 
                            btn.dataset.words || btn.dataset.difficulty;
            if (dataValue == value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    toggleOptionButton(buttonId, isActive) {
        const button = document.getElementById(buttonId);
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
}
