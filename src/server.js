// 백엔드에서 실행
import { Server } from "socket.io";
const express = require("express");
const http = require("http");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  //미들웨어 : 발생하는 이벤트 출력
  socket.onAny((event) => console.log(`Socket Event: ${event}`));
  socket.on("enter_room", (roomName, userName, done) => {
    // Room 생성
    socket.join(roomName);
    //사용자 이름
    console.log(userName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("left"));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(port, handleListen);
