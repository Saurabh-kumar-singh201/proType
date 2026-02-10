// Multiplayer controller (Socket.IO)

import { TextGenerator } from './TextGenerator.js';
import { CONFIG } from './config.js';

export class Multiplayer {
    constructor(app, ui) {
        this.app = app;
        this.ui = ui;
        this.socket = null;
        this.isEnabled = false;
        this.isInRoom = false;
        this.isHost = false;
        this.gameStarted = false;
        this.roomCode = null;
        this.players = [];

        this.cacheElements();
        this.bindUI();
    }

    cacheElements() {
        this.panel = document.getElementById('multiplayer-panel');
        this.leaderboardPanel = document.getElementById('leaderboard-panel');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.playerName = document.getElementById('player-name');
        this.roomInput = document.getElementById('room-code');
        this.createBtn = document.getElementById('create-room-btn');
        this.joinBtn = document.getElementById('join-room-btn');
        this.leaveBtn = document.getElementById('leave-room-btn');
        this.startBtn = document.getElementById('start-room-btn');
        this.roomDisplay = document.getElementById('room-display');
        this.status = document.getElementById('mp-status');
        this.soloBtn = document.getElementById('solo-btn');
        this.multiBtn = document.getElementById('multi-btn');
        this.settingsBar = document.querySelector('.settings-bar');
    }

    bindUI() {
        this.multiBtn.addEventListener('click', () => this.enableMultiplayer());
        this.soloBtn.addEventListener('click', () => this.disableMultiplayer());
        this.createBtn.addEventListener('click', () => this.createRoom());
        this.joinBtn.addEventListener('click', () => this.joinRoom());
        this.leaveBtn.addEventListener('click', () => this.leaveRoom());
        this.startBtn.addEventListener('click', () => this.startGame());
    }

    enableMultiplayer() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        this.panel.classList.add('active');
        this.leaderboardPanel.classList.add('active');
        this.multiBtn.classList.add('active');
        this.soloBtn.classList.remove('active');
        this.connect();
        this.setStatus('Multiplayer mode');
    }

    disableMultiplayer() {
        if (!this.isEnabled) return;
        this.leaveRoom();
        this.isEnabled = false;
        this.panel.classList.remove('active');
        this.leaderboardPanel.classList.remove('active');
        this.multiBtn.classList.remove('active');
        this.soloBtn.classList.add('active');
        this.setHostControls(true);
        this.setStatus('Solo mode');
    }

    connect() {
        if (this.socket) return;
        if (typeof io === 'undefined') {
            this.setStatus('Server not running');
            return;
        }
        const serverUrl = window.PROTYPE_SERVER_URL || window.location.origin;
        this.socket = io(serverUrl);

        this.socket.on('roomCreated', ({ code, hostId }) => {
            this.handleRoomJoined(code, hostId);
        });

        this.socket.on('roomJoined', ({ code, hostId }) => {
            this.handleRoomJoined(code, hostId);
        });

        this.socket.on('roomState', (payload) => {
            this.applyRoomState(payload);
        });

        this.socket.on('roomError', (message) => {
            this.setStatus(message);
        });

        this.socket.on('gameStarted', ({ text, settings }) => {
            this.gameStarted = true;
            this.applySettings(settings);
            this.app.state.softReset();
            Object.assign(this.app.state, settings);
            this.app.state.currentText = text;
            this.ui.renderText(text);
            this.ui.hideResults();
            this.ui.setTimerVisible(true);
            const timeValue = settings.mode === CONFIG.modes.TIME ? settings.timeLimit : 0;
            this.ui.resetDisplay(timeValue);
            this.app.focusTypingArea();
            this.setStatus('Game started');
        });

        this.socket.on('leaderboard', ({ players }) => {
            this.players = players;
            this.renderLeaderboard();
        });
    }

    createRoom() {
        if (!this.socket) this.connect();
        const name = this.playerName.value.trim() || 'Player';
        this.socket.emit('createRoom', { name });
    }

    joinRoom() {
        if (!this.socket) this.connect();
        const name = this.playerName.value.trim() || 'Player';
        const code = this.roomInput.value.trim().toUpperCase();
        if (!code) {
            this.setStatus('Enter a room code');
            return;
        }
        this.socket.emit('joinRoom', { code, name });
    }

    leaveRoom() {
        if (!this.socket || !this.isInRoom) return;
        this.socket.emit('leaveRoom', { code: this.roomCode });
        this.resetRoomState();
    }

    handleRoomJoined(code, hostId) {
        this.isInRoom = true;
        this.roomCode = code;
        this.roomDisplay.textContent = code;
        this.isHost = this.socket.id === hostId;
        this.startBtn.disabled = !this.isHost;
        this.setHostControls(this.isHost);
        this.setStatus(this.isHost ? 'You are the host' : 'Joined room');
    }

    applyRoomState({ code, hostId, settings, players, started }) {
        this.isInRoom = true;
        this.roomCode = code;
        this.roomDisplay.textContent = code;
        this.isHost = this.socket.id === hostId;
        this.startBtn.disabled = !this.isHost;
        this.setHostControls(this.isHost);
        this.applySettings(settings);
        this.players = players || [];
        this.renderLeaderboard();
        if (!started) this.gameStarted = false;
    }

    applySettings(settings) {
        if (!settings) return;
        Object.assign(this.app.state, settings);
        this.ui.highlightActiveButton('.mode-btn', settings.mode);
        this.ui.updateSettingsVisibility(settings.mode);
        if (settings.mode === CONFIG.modes.TIME) {
            this.ui.highlightActiveButton('.time-btn', settings.timeLimit);
        } else if (settings.mode === CONFIG.modes.WORDS) {
            this.ui.highlightActiveButton('.word-btn', settings.wordCount);
        }
        this.ui.toggleOptionButton('punctuation-btn', settings.punctuation);
        this.ui.toggleOptionButton('numbers-btn', settings.numbers);
    }

    startGame() {
        if (!this.isHost || !this.isInRoom) return;
        const settings = {
            mode: this.app.state.mode,
            timeLimit: this.app.state.timeLimit,
            wordCount: this.app.state.wordCount,
            difficulty: this.app.state.difficulty,
            punctuation: this.app.state.punctuation,
            numbers: this.app.state.numbers
        };
        const text = TextGenerator.generate(
            settings.mode,
            settings.difficulty,
            settings.mode === CONFIG.modes.WORDS ? settings.wordCount : null,
            settings.punctuation,
            settings.numbers
        );
        this.socket.emit('startGame', { code: this.roomCode, settings, text });
    }

    submitResult({ wpm, accuracy, chars, errors }) {
        if (!this.isInRoom || !this.socket) return;
        this.socket.emit('submitResult', {
            code: this.roomCode,
            wpm,
            accuracy,
            chars,
            errors
        });
    }

    renderLeaderboard() {
        if (!this.leaderboardList) return;
        this.leaderboardList.innerHTML = '';
        if (!this.players || this.players.length === 0) return;
        this.players.forEach((player) => {
            const item = document.createElement('li');
            item.className = 'leaderboard-item';
            const score = player.result ? player.result.wpm : 0;
            item.innerHTML = `<span>${player.name}</span><span class="score">${score} wpm</span>`;
            this.leaderboardList.appendChild(item);
        });
    }

    setHostControls(isHost) {
        const buttons = this.settingsBar.querySelectorAll('.mode-btn, .time-btn, .word-btn, .option-btn');
        buttons.forEach(btn => {
            btn.disabled = this.isEnabled && this.isInRoom && !isHost;
        });
    }

    setStatus(text) {
        this.status.textContent = text;
    }

    resetRoomState() {
        this.isInRoom = false;
        this.isHost = false;
        this.gameStarted = false;
        this.roomCode = null;
        this.roomDisplay.textContent = '—';
        this.startBtn.disabled = true;
        this.players = [];
        this.renderLeaderboard();
        this.setHostControls(true);
        this.setStatus(this.isEnabled ? 'Multiplayer mode' : 'Solo mode');
    }
}
