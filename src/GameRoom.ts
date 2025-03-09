import { Server } from 'socket.io';
import {v4 as uuid} from 'uuid';

export type Room = {
    roomId: string;
    users: string[]
};

export class BoardRoom {
    private static instance: BoardRoom; // Singleton instance
    private rooms: Room[] = []; // Track all rooms

    private constructor() { } // Private constructor to prevent direct instantiation

    static getInstance(): BoardRoom {
        if (!this.instance) {
            this.instance = new BoardRoom();
        }
        return this.instance;
    }

    
    createRoom(socketId: string){
        let roomId = 'room-id-'+uuid(); 
        this.rooms.push(
            {
                roomId,
                users: [socketId]
            }
        )
        
        return roomId;
    }

    joinRoom(roomId: string, socketId: string) {
        let room = this.rooms.find(room => room.roomId === roomId);
        if(!room){
            return false;

        }
        room.users.push(socketId);
        return true;
    }

   
    getRoomById(roomID: string){
        const room = this.rooms.find(room => room.roomId === `room-id-${roomID}` );
        if(!room) {
            return null;
        }
        return room;
    }

    deleteRoom(room: Room) {
        this.rooms = this.rooms.filter(existingRoom => existingRoom.roomId !== room.roomId);
    }
    setRoom(room: Room){
        this.rooms = this.rooms.filter(existingRoom => {
            if(existingRoom.roomId === room.roomId){
                return room;
            }else{
                return existingRoom;
            }
        })

        console.log(this.rooms)
    }
    removerUserFromRooms(socketId: string, io: Server) {
        let rooms = this.rooms.filter(room => room.users.includes(socketId));
        
        if (rooms.length > 0) {
            rooms.forEach(room => {
                if (room.users[0] === socketId) { // If the user is the admin (first user)
                    console.log(`Admin (${socketId}) disconnected. Closing room: ${room.roomId}`);
    
                    // Notify all users
                    io.to(room.roomId).emit("room-closed", "Admin has disconnected. Room is closed.");
    
                    // Disconnect all users in the room
                    room.users.forEach(userId => {
                        io.sockets.sockets.get(userId)?.disconnect(true);
                    });
    
                    // Remove room from server memory
                    this.rooms = this.rooms.filter(r => r.roomId !== room.roomId);
                } else {
                    // Remove only the disconnected user from the room
                    room.users = room.users.filter(user => user !== socketId);
                }
            });
        }
    }

    // Get all rooms (optional, for debugging or tracking purposes)
    getRooms(): Room[] {
        return this.rooms;
    }
}
