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
  console.log("Se ha unido el Socket ID: "+socket.id);  

  var id_user = 0;
  io.sockets.emit("online", socket.id);

  socket.on("login", (data) => {
    console.log("Usuario "+data.id_user+", conectado. ("+data.last_connection+")");
    clients[data.id_user] = socket;
    id_user = data.id_user;
    for(let i=0;i<clients.lenght;i++){
      console.log(clients[i].toString());
    };
    console.log("Usuarios conectados actualmente: "+clients.toString());
  });

  socket.on("isOnline", (msg) => {    
    let flag = false;
    let exists="Off";
    if (clients[msg.id_user]){
      flag = true;
      let exists="On";   
    }
    console.log("Fecha/hora: "+msg.last_connection+", Usuario ("+msg.id_user+"), esta online: "+exists);
    return [{"flag":flag,"id_user":msg.id_user,"last_connection":msg.last_connection}];
  });  

  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    let sourceId = msg.sourceId;
    console.log("Mensaje para: "+targetId+", Desde "+sourceId+" (Socket ID: "+socket.id+")");
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });
  socket.on("disconnect", (msg) => {
    console.log("Desconectado: "+msg);
    if (msg === "io server disconnect") {      
      socket.connect();
    }    
    console.log("Usuario desconectado: "+id_user);
    io.sockets.emit("offline", id_user);
    delete clients[id_user];
    socket.disconnect();
  });  
});

server.listen(port, "0.0.0.0", () => {
  console.log("Servidor inicializado");
});