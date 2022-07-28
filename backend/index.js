const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const port = process.env.PORT || 3001;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('<a href="https://g7-my-cars.vercel.app/">Projeto MYCARS!</a>');
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

io.on('connection', (socket) => {
  socket.on('notification', (data) => {
    socket.broadcast.emit("notification", data);
  });
});
