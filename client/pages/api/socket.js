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

            // Send file tree to a specific room
            socket.on("send-file-tree", ({ room, message }) => {
                io.to(room).emit("file-tree", message);
            });

            // Send chat message to a specific room
            socket.on("send-chat-message", (payload) => {
                const room = Object.keys(socket.rooms).find(r => r !== socket.id);
                if (room) {
                    io.to(room).emit("chat-message", payload);
                }
            });

            socket.on("typing", (username) => {
                const room = Object.keys(socket.rooms).find(r => r !== socket.id);
                if (room) {
                    io.to(room).emit("typing", username);
                }
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
