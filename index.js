const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middlewre
app.use(express.json());
var clients = {};
var clientsDebug = {};

io.on("connection", (socket) => {
  var id_user = parseInt(socket.handshake.query['id_user']);

  console.log("Se ha unido el ID: "+socket.id+", ID user: "+socket.handshake.query['id_user']);
  //console.log("Array Usuario : "+socket.handshake.query['id_user']+", Socket: "+clients[id_user]["connected"]);
  clientsDebug[id_user]= socket.id;
  io.sockets.emit("online", id_user);  

  socket.on("login", (data) => {
    console.log("LOGIN: Usuario "+data.id_user+", conectado. ("+data.last_connection+", ID "+socket.id+")");
    clients[data.id_user] = socket;
    id_user = data.id_user;
    //console.log(clients);
  });

  socket.on("isOnline", (msg) => {    
    let flag = false;
    let exists="Off";
    if (clients[msg.id_user]){
      flag = true;
      let exists="On";   
    }
    console.log("Usuario ("+msg.id_user+"), esta online: "+exists+", SocketID: "+socket.id);
    if (clients[msg.id_user])io.sockets.emit("isOnline", msg.id_user);
  });  

  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    let sourceId = msg.sourceId;
    console.log("Mensaje para: "+targetId+", Desde "+sourceId+" (Socket ID: "+socket.id+")");
    console.log("Clientes Actuales: ",clientsDebug);
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
  console.log("Servidor inicializado: ",port);
});