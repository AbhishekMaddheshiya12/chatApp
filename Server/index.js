import express from "express";
import { WebSocketServer } from "ws";
import { dbConnect } from "./config/database.js";
import userRouter from "./routes/user.js";
import Room from "./models/rooms.js";
import Chat from "./models/chat.js";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

dbConnect("mongodb://localhost:27017/webLearn");

const server = app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const wss = new WebSocketServer({ server });

app.use(express.json());

app.use('/user',userRouter);

const rooms = {};

wss.on("connection", (socket) => {
    console.log("Client connected");
  
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  
    socket.on("message", async (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (err) {
        console.error("Invalid JSON received:", message);
        socket.send(JSON.stringify({ error: "Invalid JSON format" }));
        return;
      }
  
      const { action, room, username, content, description } = parsedMessage;
  
      switch (action) {
        case "join":
          try {
            let dbRoom = await Room.findOne({ name: room });
            if (!dbRoom) {
              dbRoom = await Room.create({
                name: room,
                description: description || "Default room description",
                creator: username,
                members: [],
              });
              console.log(`Room ${room} created in database`);
            }

            if (!rooms[room]) {
              rooms[room] = new Set();
            }

            rooms[room].add(socket);
            console.log(`Client ${username} joined room ${room}`);

            if (!dbRoom.members.includes(_id)) {
              dbRoom.members.push(_id);
              await dbRoom.save();
            }
  
            socket.send(JSON.stringify({ message: `Joined room: ${room}` }));
          } catch (err) {
            console.error("Error handling join action:", err);
            socket.send(JSON.stringify({ error: "Failed to join room" }));
          }
          break;
  
        case "message":
          if (rooms[room]) {

            const addChat = await Chat.create({
                username,
                room,
                content
            })

            console.log(addChat);

            rooms[room].forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    username,
                    content,
                    room,
                  })
                );
              }
            });
  
            // Optionally, save message to database
            await Room.updateOne(
              { name: room },
              { $push: { messages: addChat } }
            );
          } else {
            socket.send(JSON.stringify({ error: "Room does not exist" }));
          }
          break;
  
        case "leave":
          if (rooms[room]) {
            rooms[room].delete(socket);
            console.log(`Client ${username} left room ${room}`);
  
            // Optionally, remove member from database
            await Room.updateOne(
              { name: room },
              { $pull: { members: username } }
            );
  
            socket.send(JSON.stringify({ message: `Left room: ${room}` }));
          } else {
            socket.send(JSON.stringify({ error: "Room does not exist" }));
          }
          break;
  
        default:
          socket.send(JSON.stringify({ error: "Unknown action" }));
      }
    });
  
    socket.on("close", () => {
      console.log("Client disconnected");
      for (const room in rooms) {
        if (rooms[room].has(socket)) {
          rooms[room].delete(socket);
          console.log(`Socket removed from room ${room}`);
        }
      }
    });
  
    socket.send("Hello from the server!");
  });
  
