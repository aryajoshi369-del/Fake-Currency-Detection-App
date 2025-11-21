import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMessages, GetUserList, sendMessage } from "../api/allApi";
import "./chat.css";

function Chat({ id }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userId = id || sessionStorage.getItem("id");
    setLoading(true);
    GetUserList(token)
      .then((response) => {
        const loggedInUser = response.data.find((user) => user.id == userId);
        if (!loggedInUser) return;

        const isControlRoom = (loggedInUser.control_room === true || loggedInUser.control_room === "true") && !loggedInUser.is_superuser;

const filteredUsers = response.data.filter((user) => 
  (user.control_room !== isControlRoom) && !user.is_superuser
);

        setUsers(filteredUsers);
        if (filteredUsers.length > 0) {
          setSelectedUser(filteredUsers[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, id]);

  const fetchMessages = useCallback(() => {
    if (!selectedUser) return;
    getMessages(token, selectedUser.id)
      .then((response) => setMessages(response.data))
      .catch(console.error);
  }, [selectedUser, token]);

  useEffect(() => {
    fetchMessages(); 
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval); 
  }, [fetchMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      sendMessage(token, selectedUser.id, newMessage)
        .then((response) => {
          setMessages((prev) => [...prev, response.data]);
          setNewMessage("");
        })
        .catch(console.error);
    },
    [newMessage, selectedUser, token]
  );

  return (
    <div className="custom-chat-container d-flex flex-column flex-md-row bg-dark text-white">
      <aside className="custom-sidebar d-flex flex-column">
        <div className="search-box position-relative p-2">
          <h5 className="text-center">Chat </h5>
        </div>

        <div className="user-list flex-grow-1 overflow-auto p-3">
          {loading ? <p>Loading...</p> :
            users.map((user) => (
              <div
                key={user.id}
                className={`list-group-item list-group-item-action d-flex align-items-center bg-secondary text-white rounded mb-2 ${
                  selectedUser?.id === user.id ? "active bg-primary" : ""
                }`}
                onClick={() => setSelectedUser(user)}
                style={{ cursor: "pointer" }}
              >
                <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center me-3">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="mb-0 fw-bold">{user.first_name}</p>
                </div>
              </div>
            ))}
        </div>
      </aside>

      <main className="custom-chat-window flex-grow-1 d-flex flex-column">
        <header className="d-flex justify-content-between align-items-center bg-secondary p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <i className="fa fa-user-circle fs-3 text-white me-2"></i>
            <p className="mb-0 fs-5 fw-bold">{selectedUser?.first_name || "Select a user"}</p>
          </div>
        </header>

        <div className="custom-messages flex-grow-1 p-3 overflow-auto">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((msg) => {
              const isSender = String(msg.sender) === String(id || sessionStorage.getItem("id"));

              return (
                <div key={msg.id} className={`d-flex ${isSender ? "justify-content-end" : "justify-content-start"} mb-2`}>
                  {!isSender && (
                    <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <div className={`chat-bubble ${isSender ? "bg-primary text-white" : "bg-secondary text-white"} p-2 rounded`}> 
                    <div>{msg.message}</div>
                    <small className="text-info text-end " style={{ fontSize: "0.75rem", textAlign: isSender ? "right" : "left" }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  {isSender && (
                    <div className="avatar bg-light text-dark rounded-circle d-flex align-items-center justify-content-center ms-2">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-input-container d-flex align-items-center bg-secondary p-3 border-top border-secondary">
          <form className="d-flex align-items-center w-100" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${selectedUser?.first_name || ""}...`} 
              className="form-control flex-grow-1 bg-dark text-white rounded px-3"
            />
            <button type="submit" className="send-button ms-2">
              <i className="fa fa-paper-plane text-primary fs-4"></i>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}

export default Chat;
