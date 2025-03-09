"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRoom = void 0;
const uuid_1 = require("uuid");
class BoardRoom {
    static instance; // Singleton instance
    rooms = []; // Track all rooms
    constructor() { } // Private constructor to prevent direct instantiation
    static getInstance() {
        if (!this.instance) {
            this.instance = new BoardRoom();
        }
        return this.instance;
    }
    // Create a new room and add Player 1
    createRoom(player1, isPrivate = false, privateRoomId) {
        const newRoom = {
            roomId: `room-id-${!isPrivate ? (0, uuid_1.v4)() : privateRoomId}`,
            players: { player1 },
            isPrivate
        };
        this.rooms.push(newRoom);
        return newRoom;
    }
    // Get an empty room where Player 2 can join
    getAnEmptyRoom() {
        return this.rooms.find((room) => Object.keys(room.players).length === 1 && !room.isPrivate);
    }
    // Add Player 2 to an empty room
    addToRoom(player2, isPrivate = false, privateRoomId) {
        if (isPrivate) {
            const privateRoom = this.getRoomById(privateRoomId);
            console.log('private room got from addToRoom: ', privateRoom);
            if (privateRoom) {
                privateRoom.players.player2 = player2;
            }
            else {
                const privateRoom = this.createRoom(player2, true, privateRoomId);
                return privateRoom;
            }
            return privateRoom;
        }
        const emptyRoom = this.getAnEmptyRoom();
        if (!emptyRoom) {
            const room = this.createRoom(player2, false, '');
            return room;
        }
        emptyRoom.players.player2 = player2;
        return emptyRoom;
    }
    getRoom(player) {
        return this.rooms.find(room => room.players.player1 === player || room.players.player2 === player);
    }
    getRoomById(roomID) {
        const room = this.rooms.find(room => room.roomId === `room-id-${roomID}`);
        if (!room) {
            return null;
        }
        return room;
    }
    deleteRoom(room) {
        this.rooms = this.rooms.filter(existingRoom => existingRoom.roomId !== room.roomId);
    }
    setRoom(room) {
        this.rooms = this.rooms.filter(existingRoom => {
            if (existingRoom.roomId === room.roomId) {
                return room;
            }
            else {
                return existingRoom;
            }
        });
        console.log(this.rooms);
    }
    // Get all rooms (optional, for debugging or tracking purposes)
    getRooms() {
        return this.rooms;
    }
}
exports.BoardRoom = BoardRoom;
//# sourceMappingURL=GameRoom.js.map