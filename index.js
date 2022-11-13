const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middlewre
app.use(express.json());
var clients = {};

io.on("connection", (socket) => {
  console.log("connected");
  console.log("Se ha unido el ID: "+socket.id);
  socket.on("login", (data) => {
    console.log("Usuario "+data.id_user+", conectado. ("+data.last_connection+")");
    clients[data.id_user] = socket;
    console.log(clients);
  });
  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });
  socket.on("disconnect", (msg) => {
    if (msg === "io server disconnect") {      
      socket.connect();
    }
    console.log("Usuario ("+clients[socket.id]+") desconectado.");
    delete users[socket.id]; 
  });  
});

server.listen(port, "0.0.0.0", () => {
  console.log("Servidor inicializado");
});
