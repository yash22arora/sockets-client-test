import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [text, setText] = useState("");
  const [livestreamInfo, setLivestreamInfo] = useState({
    livestreamId: "",
    customerId: "",
  });
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.emit("findAllMessages", {}, (response) => {
      console.log(response);
      setChat(response);
    });
  });

  const join = (e) => {
    e.preventDefault();
    socket.emit("join", { livestreamInfo }, () => {
      setJoined(true);
    });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("createMessage", { text }, () => {
      setText("");
    });
  };

  const onInfoChange = (e) => {
    setLivestreamInfo({ ...livestreamInfo, [e.target.name]: e.target.value });
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const renderChat = () => {
    return chat.map((message, index) => {
      return (
        <div key={index}>
          <p>
            [{message.name}]: {message.text}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Chat</h1>
      <div className="chatLog">{renderChat()}</div>
      <form
        onSubmit={joined ? (e) => onMessageSubmit(e) : (e) => join(e)}
        className="chatForm"
      >
        {!joined ? (
          <>
            <p>Enter Customer ID:</p>
            <input
              name="customerId"
              placeholder="Customer Id"
              value={livestreamInfo.customerId}
              onChange={(e) => onInfoChange(e)}
            />
            <p>Enter Livestream ID:</p>
            <input
              name="livestreamId"
              placeholder="Livestream Id"
              value={livestreamInfo.livestreamId}
              onChange={(e) => onInfoChange(e)}
            />
          </>
        ) : (
          <>
            <input
              name="message"
              placeholder="Message"
              value={text}
              onChange={(e) => onTextChange(e)}
            />
          </>
        )}

        <button type="submit">{joined ? "Send" : "Join"}</button>
      </form>
    </>
  );
}

export default App;
