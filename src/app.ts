import express from "express";
import { BoardRoom } from "./GameRoom";
import cors from 'cors'
const app = express();


app.use(cors({
  origin: ["https://boardstorm.vercel.app/", "http://localhost:3000/"],
  methods: ["GET", "POST"],
  credentials: true

}))

// Middleware
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express + TypeScript server!");
});

const boardRoom = BoardRoom.getInstance();



app.get('/rooms', (req,res) => {
  const rooms = boardRoom.getRooms();
  console.log('rooms')
  res.json({rooms});
})



// Export the app
export default app;
