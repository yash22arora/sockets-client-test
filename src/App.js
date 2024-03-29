import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function App() {
  const [message, setMessage] = useState("");
  const [livestreamInfo, setLivestreamInfo] = useState({
    livestreamId: "",
    customerId: "",
  });
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);
  const [userName, setCustomer] = useState("");
  const [livestreamId, setLivestreamId] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    socket.on("chat", (data) => {
      console.log(data)
      setChat((prev) => [...prev, data]);
      console.log(data)
      setMessage("")
  });
  }, []);

  const join = (e) => {
    e.preventDefault();
    socket.emit("join", { ...livestreamInfo }, (response) => {
      setCustomer(response.userName);
      setLivestreamId(response.livestreamId);
      setJoined(true);
      setIsSeller(response.isSeller);
    });
  };
  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("createMessage", { userName, livestreamId, message, isSeller }, (response) => {
      console.log(response)
      setMessage("");
    });
  };

  const onInfoChange = (e) => {
    setLivestreamInfo({ ...livestreamInfo, [e.target.name]: e.target.value });
  };

  const onTextChange = (e) => {
    setMessage(e.target.value);
  };

  const renderChat = () => {
    return chat.map((message, index) => {
      return (
        <div key={index}>
          <p>
            [{message.userName}]: {message.message}
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
              value={message}
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
