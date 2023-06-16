// socket io 연결
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

// 대화 내용 => 저장하기
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, userName, () => {
    addMessage(`${userName}: ${value}`);
  });
  input.value = "";
}

socket.on("new_message", addMessage);

// 대화창 입력 정보 : 사용자 정보 사용하는 방법, 저장하기
function handleRoomSubmit(event) {
  event.preventDefault();
  const input_room = form.querySelector('input[placeholder= "Room Number"]');
  const input_name = form.querySelector('input[placeholder= "Name"]');
  // send 명령어
  socket.emit("enter_room", input_room.value, input_name.value, showRoom);
  roomName = input_room.value;
  userName = input_name.value;
  input_room.value = "";
  input_name.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

// 대화창으로 넘어가기
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("left", () => {
  addMessage("someone left...");
});
