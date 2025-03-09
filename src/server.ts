import { Server } from "socket.io";
import { createServer } from "http"; // Import to create a shared server
import app from "./app"; // Your Express app
import { BoardRoom, Room } from "./GameRoom";
// Set up the port
const PORT = parseInt(process.env.PORT) || 5000;
import {v4 as uuid} from 'uuid'


// Create a shared HTTP server
const httpServer = createServer(app); // Pass the Express app

// Attach Socket.io to the same server
const io = new Server(httpServer, {
    cors: {
        origin: ["https://boardstorm.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true, // Ensure cookies are sent if needed
    },
});

console.log(`Server running on port ${PORT}`);

// Singleton instance of GameRoom
const boardRoom = BoardRoom.getInstance();

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("create-room", () => {
       let roomId = boardRoom.createRoom(socket.id);       
        socket.join(roomId);
        socket.emit("room-created", {
            roomId
        });
    })
    
    socket.on('join-room', (data) => {
        const {roomid} = data;
        const hasJoined = boardRoom.joinRoom(roomid, socket.id);
        if(hasJoined){
            socket.join(roomid);
            socket.emit('joined-room');
            socket.to(roomid).emit("collaborator-joined", {roomid});
        }else{
            socket.emit('error-while-room-joining', {roomid});
            
        }
    })

    socket.on("share-canvas", (data) => {
        console.log("sharing canvas");
        data = JSON.parse(data);
        console.log(data.roomId);
        console.log(data.canvasData);
        socket.to(data.roomId).emit("update-canvas", {updatedCanvas: data.canvasData, user: socket.id});
    })

    socket.on("disconnect", () => {
        boardRoom.removerUserFromRooms(socket.id,io);
        console.log("Client Disconnected: ", socket.id)
    })
});


// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
