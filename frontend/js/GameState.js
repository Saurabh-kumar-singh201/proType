// Game State Management

import { CONFIG } from './config.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.mode = CONFIG.defaults.mode;
        this.timeLimit = CONFIG.defaults.timeLimit;
        this.wordCount = CONFIG.defaults.wordCount;
        this.difficulty = CONFIG.defaults.difficulty;
        this.punctuation = false;
        this.numbers = false;
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.isActive = false;
        this.isComplete = false;
        this.errors = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.timerInterval = null;
        this.wpmInterval = null;
    }

    start() {
        this.isActive = true;
        this.startTime = Date.now();
    }

    end() {
        this.isComplete = true;
        this.isActive = false;
        this.endTime = Date.now();
        this.clearIntervals();
    }

    clearIntervals() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.wpmInterval) {
            clearInterval(this.wpmInterval);
            this.wpmInterval = null;
        }
    }

    calculateWPM() {
        if (!this.startTime) return 0;
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60;
        const wordsTyped = this.correctChars / 5;
        return Math.round(wordsTyped / timeElapsed) || 0;
    }

    calculateAccuracy() {
        if (this.totalChars === 0) return 100;
        return Math.round((this.correctChars / this.totalChars) * 100);
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    getRemainingTime() {
        const elapsed = this.getElapsedTime();
        return Math.max(0, this.timeLimit - elapsed);
    }

    getProgress() {
        if (this.mode === CONFIG.modes.TIME) {
            return (this.getElapsedTime() / this.timeLimit) * 100;
        } else if (this.mode === CONFIG.modes.WORDS || this.mode === CONFIG.modes.QUOTE) {
            return (this.currentIndex / this.currentText.length) * 100;
        }
        return 0;
    }

    recordKeystroke(isCorrect) {
        this.totalChars++;
        if (isCorrect) {
            this.correctChars++;
        } else {
            this.errors++;
        }
    }

    // Preserve settings during reset
    softReset() {
        const savedSettings = {
            mode: this.mode,
            timeLimit: this.timeLimit,
            wordCount: this.wordCount,
            difficulty: this.difficulty,
            punctuation: this.punctuation,
            numbers: this.numbers
        };

        this.reset();
        Object.assign(this, savedSettings);
    }
}
