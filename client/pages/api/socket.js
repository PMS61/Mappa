import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
            },
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            // Join a room
            socket.on("joinRoom", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);
                io.to(room).emit("message", `User ${socket.id} joined ${room}`);
            });

            // Send message to a specific room
            socket.on("sendMessage", ({ room, message }) => {
                io.to(room).emit("message", message);
            });

            // Leave a room
            socket.on("leaveRoom", (room) => {
                socket.leave(room);
                console.log(`User ${socket.id} left room: ${room}`);
                io.to(room).emit("message", `User ${socket.id} left ${room}`);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}
