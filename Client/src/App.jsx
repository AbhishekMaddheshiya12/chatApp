import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";

function Home() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket and set in state
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        alert(data.error);
      } else if (data.message) {
        console.log(data.message);
      } else if (data.content && data.username) {
        // Add new message to the chat
        setMessages((prev) => [...prev, { username: data.username, content: data.content }]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Save WebSocket to state
    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  const joinRoom = () => {
    if (!username || !room) {
      alert("Username and room name are required");
      return;
    }

    socket?.send(
      JSON.stringify({
        action: "join",
        username,
        room,
        description: "This is a test room",
      })
    );

    setIsConnected(true);
  };

  const leaveRoom = () => {
    socket?.send(
      JSON.stringify({
        action: "leave",
        username,
        room,
      })
    );

    setIsConnected(false);
    setMessages([]);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket?.send(
      JSON.stringify({
        action: "message",
        username,
        room,
        content: message,
      })
    );

    setMessage("");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Real-Time Chat
      </Typography>

      {!isConnected ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Room Name"
            variant="outlined"
            fullWidth
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={joinRoom}>
            Join Room
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Room: {room}</Typography>
            <Button variant="contained" color="error" onClick={leaveRoom}>
              Leave Room
            </Button>
          </Box>

          <List sx={{ mb: 3, border: "1px solid #ccc", borderRadius: 2, p: 2, height: 300, overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${msg.username}:`}
                  secondary={msg.content}
                />
              </ListItem>
            ))}
          </List>

          <form onSubmit={sendMessage}>
            <TextField
              placeholder="Write a message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Send
            </Button>
          </form>
        </>
      )}
    </Box>
  );
}

export default Home;
