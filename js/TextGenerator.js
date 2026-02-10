// Text Generation Module

import { WORD_POOLS, QUOTES, PUNCTUATION_MARKS, CONFIG } from './config.js';

export class TextGenerator {
    static generate(mode, difficulty, wordCount, usePunctuation, useNumbers) {
        if (mode === CONFIG.modes.QUOTE) {
            return this.generateQuote();
        }
        return this.generateWords(difficulty, wordCount, usePunctuation, useNumbers);
    }

    static generateQuote() {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }

    static generateWords(difficulty, count, usePunctuation, useNumbers) {
        const pool = WORD_POOLS[difficulty];
        const words = [];
        const actualCount = count || 200;

        for (let i = 0; i < actualCount; i++) {
            let word = this.getRandomWord(pool).toLowerCase();
            const shouldCapitalize = usePunctuation && (i === 0 || Math.random() < 0.25);
            if (shouldCapitalize) {
                word = this.capitalize(word);
            }

            words.push(word);

            // Add punctuation
            if (usePunctuation && i < actualCount - 1) {
                if (Math.random() < CONFIG.punctuationFrequency) {
                    const punct = this.getRandomPunctuation();
                    words[words.length - 1] += punct;

                    // Capitalize next word after sentence-ending punctuation
                    if (this.isSentenceEnding(punct) && i + 1 < actualCount) {
                        i++;
                        let nextWord = this.getRandomWord(pool);
                        nextWord = this.capitalize(nextWord);
                        words.push(nextWord);
                    }
                }
            }

            // Add numbers
            if (useNumbers && Math.random() < CONFIG.numberFrequency) {
                words.push(this.generateNumber());
            }
        }

        // Ensure last word ends with period if punctuation is enabled
        if (usePunctuation && !this.endsWithPunctuation(words[words.length - 1])) {
            words[words.length - 1] += '.';
        }

        return words.join(' ');
    }

    static getRandomWord(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    static getRandomPunctuation() {
        return PUNCTUATION_MARKS[Math.floor(Math.random() * PUNCTUATION_MARKS.length)];
    }

    static capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    static isSentenceEnding(punct) {
        return punct === '.' || punct === '!' || punct === '?';
    }

    static endsWithPunctuation(word) {
        return /[.!?]$/.test(word);
    }

    static generateNumber() {
        const generators = [
            () => Math.floor(Math.random() * 100).toString(),
            () => Math.floor(Math.random() * 1000).toString(),
            () => (1900 + Math.floor(Math.random() * 125)).toString()
        ];
        const generator = generators[Math.floor(Math.random() * generators.length)];
        return generator();
    }
}
