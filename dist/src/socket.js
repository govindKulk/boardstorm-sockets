"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http"); // Import to create a shared server
const app_1 = __importDefault(require("./app")); // Your Express app
const GameRoom_1 = require("./GameRoom");
// Set up the port
const PORT = parseInt(process.env.PORT) || 3000;
// Create a shared HTTP server
const httpServer = (0, http_1.createServer)(app_1.default); // Pass the Express app
// Attach Socket.io to the same server
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["https://sockets-tic-tac-toe.vercel.app/", "http://localhost:5173/"],
        methods: ["GET", "POST"],
        credentials: true, // Ensure cookies are sent if needed
    },
});
console.log(`Server running on port ${PORT}`);
// Singleton instance of GameRoom
const boardRoom = GameRoom_1.BoardRoom.getInstance();
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
});
// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=socket.js.map