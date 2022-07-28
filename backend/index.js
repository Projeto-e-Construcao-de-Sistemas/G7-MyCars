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
  res.send('<h1>Webservice do projeto MyCars</h1>');
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

io.on('connection', (socket) => {
  console.log("client connected!");
  socket.on('notification', (data)=>{
    console.log("new notification");
   socket.broadcast.emit("notification", data);
  });
});
