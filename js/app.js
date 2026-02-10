// Main Application Controller

import { GameState } from './GameState.js';
import { TextGenerator } from './TextGenerator.js';
import { UI } from './UI.js';
import { CONFIG } from './config.js';
import { Multiplayer } from './Multiplayer.js';

class ProTypeApp {
    constructor() {
        this.state = new GameState();
        this.ui = new UI();
        this.multiplayer = new Multiplayer(this, this.ui);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateNewText();
        this.focusTypingArea();
    }

    setupEventListeners() {
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleModeChange(btn));
        });

        // Time buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleTimeChange(btn));
        });

        // Word count buttons
        document.querySelectorAll('.word-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleWordCountChange(btn));
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDifficultyChange(btn));
        });

        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleOptionToggle(btn));
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Results actions
        document.getElementById('try-again-btn').addEventListener('click', () => this.restart());

        // Focus typing area on click
        this.ui.typingContainer.addEventListener('click', () => this.focusTypingArea());
    }

    handleModeChange(btn) {
        this.state.mode = btn.dataset.mode;
        this.ui.highlightActiveButton('.mode-btn', this.state.mode);
        this.ui.updateSettingsVisibility(this.state.mode);
        this.broadcastSettings();
        this.restart();
    }

    handleTimeChange(btn) {
        this.state.timeLimit = parseInt(btn.dataset.time);
        this.ui.highlightActiveButton('.time-btn', this.state.timeLimit);
        this.broadcastSettings();
        this.restart();
    }

    handleWordCountChange(btn) {
        this.state.wordCount = parseInt(btn.dataset.words);
        this.ui.highlightActiveButton('.word-btn', this.state.wordCount);
        this.broadcastSettings();
        this.restart();
    }

    handleDifficultyChange(btn) {
        this.state.difficulty = btn.dataset.difficulty;
        this.ui.highlightActiveButton('.difficulty-btn', this.state.difficulty);
        this.broadcastSettings();
        this.restart();
    }

    handleOptionToggle(btn) {
        const option = btn.dataset.option;
        this.state[option] = !this.state[option];
        this.ui.toggleOptionButton(btn.id, this.state[option]);
        this.broadcastSettings();
        this.restart();
    }

    broadcastSettings() {
        if (!this.multiplayer.isEnabled || !this.multiplayer.isInRoom || !this.multiplayer.isHost) return;
        this.multiplayer.socket.emit('updateSettings', {
            code: this.multiplayer.roomCode,
            settings: {
                mode: this.state.mode,
                timeLimit: this.state.timeLimit,
                wordCount: this.state.wordCount,
                difficulty: this.state.difficulty,
                punctuation: this.state.punctuation,
                numbers: this.state.numbers
            }
        });
    }

    handleKeyDown(e) {
        // Restart shortcuts
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            this.restart();
            return;
        }

        if (this.state.isComplete) return;

        if (this.multiplayer.isEnabled && this.multiplayer.isInRoom && !this.multiplayer.gameStarted) {
            return;
        }

        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            if (e.key.length === 1 || e.key === 'Backspace') {
                e.preventDefault();
            }
        }

        // Start test on first keypress
        if (!this.state.isActive && !e.ctrlKey && !e.altKey && !e.metaKey) {
            this.startTest();
        }

        if (!this.state.isActive) return;

        // Handle character input
        if (e.key.length === 1) {
            this.handleCharacterInput(e.key);
        } 
        // Handle backspace
        else if (e.key === 'Backspace' && this.state.currentIndex > 0) {
            e.preventDefault();
            this.handleBackspace();
        }
    }

    handleCharacterInput(key) {
        const currentChar = this.state.currentText[this.state.currentIndex];
        const isCorrect = key === currentChar;

        this.state.recordKeystroke(isCorrect);
        this.ui.updateCharacterState(this.state.currentIndex, isCorrect);
        this.state.currentIndex++;

        this.updateLiveStats();
        this.checkCompletion();
    }

    handleBackspace() {
        this.state.currentIndex--;
        this.ui.removeCharacterState(this.state.currentIndex);
    }

    startTest() {
        this.state.start();
        this.ui.setActiveState(true);

        // Start timer for time mode
        if (this.state.mode === CONFIG.modes.TIME) {
            this.state.timerInterval = setInterval(() => {
                const remaining = this.state.getRemainingTime();
                this.ui.updateStats(
                    this.state.calculateWPM(),
                    this.state.calculateAccuracy(),
                    remaining,
                    this.state.correctChars
                );
                this.ui.updateProgress(this.state.getProgress());

                if (remaining <= 0) {
                    this.endTest();
                }
            }, 100);
        }

        // Update WPM continuously
        this.state.wpmInterval = setInterval(() => {
            this.updateLiveStats();
        }, 100);
    }

    updateLiveStats() {
        const wpm = this.state.calculateWPM();
        const accuracy = this.state.calculateAccuracy();
        const time = this.state.mode === CONFIG.modes.TIME 
            ? this.state.getRemainingTime() 
            : this.state.getElapsedTime();
        
        this.ui.updateStats(wpm, accuracy, time, this.state.correctChars);
        this.ui.updateProgress(this.state.getProgress());
    }

    checkCompletion() {
        const isWordsComplete = this.state.mode === CONFIG.modes.WORDS && 
                               this.state.currentIndex >= this.state.currentText.length;
        const isQuoteComplete = this.state.mode === CONFIG.modes.QUOTE && 
                               this.state.currentIndex >= this.state.currentText.length;

        if (isWordsComplete || isQuoteComplete) {
            this.endTest();
        }
    }

    endTest() {
        this.state.end();
        this.ui.setActiveState(false);
        this.ui.setTimerVisible(false);
        if (this.multiplayer.isEnabled && this.multiplayer.isInRoom) {
            this.multiplayer.submitResult({
                wpm: this.state.calculateWPM(),
                accuracy: this.state.calculateAccuracy(),
                chars: this.state.correctChars,
                errors: this.state.errors
            });
        }
        this.showResults();
    }

    showResults() {
        const wpm = this.state.calculateWPM();
        const accuracy = this.state.calculateAccuracy();
        
        this.ui.showResults(
            wpm,
            accuracy,
            this.state.correctChars,
            this.state.errors
        );
    }

    generateNewText() {
        const wordCount = this.state.mode === CONFIG.modes.WORDS ? this.state.wordCount : null;
        this.state.currentText = TextGenerator.generate(
            this.state.mode,
            this.state.difficulty,
            wordCount,
            this.state.punctuation,
            this.state.numbers
        );
        this.ui.renderText(this.state.currentText);
    }

    restart() {
        this.state.softReset();
        this.ui.hideResults();
        this.ui.setTimerVisible(true);
        this.ui.resetDisplay(
            this.state.mode === CONFIG.modes.TIME ? this.state.timeLimit : 0
        );
        this.generateNewText();
        this.focusTypingArea();
    }

    focusTypingArea() {
        this.ui.typingContainer.focus();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProTypeApp();
});
