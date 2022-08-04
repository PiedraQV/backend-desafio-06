const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

const productos = [
  {
    title: "Vans Yellow",
    price: 150,
    thumbnail:
      "https://images.vans.com/is/image/Vans/WKTCA1-HERO?$583x583$",
    id: 1,
  },
  {
    title: "Vans Blue SK8",
    price: 130,
    thumbnail:
      "https://http2.mlstatic.com/D_NQ_NP_745177-MLM32037822918_092019-O.jpg",
    id: 2,
  },
  {
    title: "Nikes Bota Alta",
    price: 140,
    thumbnail:
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8c01c614-8078-4303-ad55-de5ac66d78ae/lebron-witness-5-basketball-shoes-XJrPgC.png",
    id: 3,
  }
];


const msgs = [];

app.use(express.static(__dirname + "/public"));

server.listen(4000, () => {
  console.log("Servidor corriendo en:" + PORT);
});

app.use(express.json());
io.on("connection", (socket) => {
  console.log("Un usuario entró con exito");

  socket.emit("msg_back", msgs);

  socket.emit("data_ready", productos);

  socket.on("data_client", (data) => {
    msgs.push(data);

    io.sockets.emit("msg_back", msgs);

    fs.unlink("chatlog.txt", (err) => {
      if (err) throw "Error al eliminar";
    });
    fs.writeFile("chatlog.txt", "", "utf-8", (err) => {
      if (err) throw "Error al crear un nuevo producto";
    });
    fs.appendFile("chatlog.txt", JSON.stringify(msgs), "utf-8", (err) => {
      if (err) throw "Error error";

      console.log("Agregado exitosamente");
    });
  });

  socket.on("data_array", (data) => {
    productos.push(data);
    io.sockets.emit("data_ready", productos);
  });

  //Routes
});
app.get("/", (req, res) => {
  res.sendFile("index.html");
});