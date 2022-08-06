import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
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
    socket.emit("join", { name }, () => {
      setJoined(true);
    });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("createMessage", { text }, () => {
      setText("");
    });
  };

  const onNameChange = (e) => {
    setName(e.target.value);
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
            <p>Enter Name:</p>
            <input
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => onNameChange(e)}
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

        <button type="submit">Send Message</button>
      </form>
    </>
  );
}

export default App;
