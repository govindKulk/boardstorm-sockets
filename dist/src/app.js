"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GameRoom_1 = require("./GameRoom");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Define routes
app.get("/", (req, res) => {
    res.send("Welcome to the Express + TypeScript server!");
});
const boardRoom = GameRoom_1.BoardRoom.getInstance();
app.use((0, cors_1.default)({
    origin: ["https://sockets-tic-tac-toe.vercel.app/", "http://localhost:5173/"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.get('/rooms', (req, res) => {
    const rooms = boardRoom.getRooms();
    console.log('rooms');
    res.json({ rooms });
});
// Export the app
exports.default = app;
//# sourceMappingURL=app.js.map