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
  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });
  socket.on("message", (msg) => {
    console.log(msg+" | "+hash);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message",msg);
  });
/*   socket.on('disconnect', function () {
    socket.sockets.emit('Usuario', socket.id + ' se ha desconectado del servidor.');
    delete clients[socket.id];
    socket.sockets.emit('logout', clients);
  }); */  
});

server.listen(port, "0.0.0.0", () => {
  console.log("Servidor inicializado");
});
