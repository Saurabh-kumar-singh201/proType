// Simple multiplayer server (Express + Socket.IO)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

const rooms = new Map();

function generateCode() {
    const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }
    return code;
}

function createRoom(code, hostId, hostName) {
    rooms.set(code, {
        hostId,
        settings: {
            mode: 'time',
            timeLimit: 15,
            wordCount: 25,
            difficulty: 'easy',
            punctuation: false,
            numbers: false
        },
        started: false,
        players: new Map([[hostId, { name: hostName, result: null }]])
    });
}

function roomStatePayload(code) {
    const room = rooms.get(code);
    if (!room) return null;
    return {
        code,
        hostId: room.hostId,
        settings: room.settings,
        started: room.started,
        players: Array.from(room.players.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            result: data.result
        }))
    };
}

function emitRoomState(code) {
    const payload = roomStatePayload(code);
    if (!payload) return;
    io.to(code).emit('roomState', payload);
    emitLeaderboard(code);
}

function emitLeaderboard(code) {
    const room = rooms.get(code);
    if (!room) return;
    const players = Array.from(room.players.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        result: data.result
    })).sort((a, b) => {
        const aScore = a.result ? a.result.wpm : 0;
        const bScore = b.result ? b.result.wpm : 0;
        return bScore - aScore;
    });
    io.to(code).emit('leaderboard', { players });
}

io.on('connection', (socket) => {
    socket.on('createRoom', ({ name }) => {
        let code = generateCode();
        while (rooms.has(code)) code = generateCode();
        createRoom(code, socket.id, name || 'Player');
        socket.join(code);
        socket.data.roomCode = code;
        socket.emit('roomCreated', { code, hostId: socket.id });
        emitRoomState(code);
    });

    socket.on('joinRoom', ({ code, name }) => {
        const room = rooms.get(code);
        if (!room) {
            socket.emit('roomError', 'Room not found');
            return;
        }
        socket.join(code);
        socket.data.roomCode = code;
        room.players.set(socket.id, { name: name || 'Player', result: null });
        socket.emit('roomJoined', { code, hostId: room.hostId });
        emitRoomState(code);
    });

    socket.on('leaveRoom', ({ code }) => {
        const room = rooms.get(code);
        if (!room) return;
        room.players.delete(socket.id);
        socket.leave(code);
        socket.data.roomCode = null;
        if (room.players.size === 0) {
            rooms.delete(code);
            return;
        }
        if (room.hostId === socket.id) {
            const [nextHostId] = room.players.keys();
            room.hostId = nextHostId;
        }
        emitRoomState(code);
    });

    socket.on('updateSettings', ({ code, settings }) => {
        const room = rooms.get(code);
        if (!room || room.hostId !== socket.id) return;
        room.settings = { ...room.settings, ...settings };
        emitRoomState(code);
    });

    socket.on('startGame', ({ code, settings, text }) => {
        const room = rooms.get(code);
        if (!room || room.hostId !== socket.id) return;
        room.settings = settings;
        room.started = true;
        room.text = text;
        room.players.forEach((player) => { player.result = null; });
        io.to(code).emit('gameStarted', { text, settings });
        emitRoomState(code);
    });

    socket.on('submitResult', ({ code, wpm, accuracy, chars, errors }) => {
        const room = rooms.get(code);
        if (!room) return;
        const player = room.players.get(socket.id);
        if (!player) return;
        player.result = { wpm, accuracy, chars, errors };
        emitLeaderboard(code);
    });

    socket.on('disconnect', () => {
        const code = socket.data.roomCode;
        if (!code) return;
        const room = rooms.get(code);
        if (!room) return;
        room.players.delete(socket.id);
        if (room.players.size === 0) {
            rooms.delete(code);
            return;
        }
        if (room.hostId === socket.id) {
            const [nextHostId] = room.players.keys();
            room.hostId = nextHostId;
        }
        emitRoomState(code);
    });
});

server.listen(PORT, () => {
    console.log(`ProType server running on http://localhost:${PORT}`);
});
