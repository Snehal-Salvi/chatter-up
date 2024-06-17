import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import styles from "./Chat.module.css";
import Rooms from "../../Pages/Sidebar/Rooms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { BACKEND_URL } from "../../utils/constants.js";

const socket = io(BACKEND_URL);

function Chat({ name }) {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    const handleMessageReceived = (message) => {
      if (message.sender !== name) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.emit("join", roomId);

    socket.on("roomData", (room) => {
      setCurrentRoom(room);
      setMessages(room.messages);
    });

    socket.on("message", handleMessageReceived);

    socket.on("typing", (userName) => {
      if (userName !== name) {
        setTyping(`${userName} is typing...`);
      }
    });

    socket.on("stopTyping", () => {
      setTyping("");
    });

    return () => {
      socket.off("roomData");
      socket.off("message", handleMessageReceived);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [roomId, name]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && currentRoom) {
      const newMessage = {
        sender: name,
        text: message,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit("sendMessage", currentRoom._id, message, name);

      setMessage("");
      socket.emit("stopTyping", roomId);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", roomId, name);

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", roomId);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRoomSelect = (room) => {
    setCurrentRoom(room);
    socket.emit("join", room._id);
  };

  return (
    <div className={styles.chatScreen}>
      <div className={styles.roomsContainer}>
        <Rooms onSelectRoom={handleRoomSelect} />
      </div>

      <div className={styles.chatContainer}>
        {!currentRoom ? (
          <p className={styles.selectRoomMessage}>
            Select a room to start a conversation!!
          </p>
        ) : (
          <>
            <div className={styles.roomHeader}>
              <h2>You are in room: {currentRoom.name}</h2>
            </div>

            <div className={styles.chatBox}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.messageContainer} ${
                    msg.sender === name ? styles.myMessage : styles.otherMessage
                  }`}
                >
                  <div
                    className={`${styles.arrow} ${
                      msg.sender === name ? styles.arrowRight : styles.arrowLeft
                    }`}
                  >
                    <div className={styles.outer}></div>
                    <div className={styles.inner}></div>
                  </div>
                  <div className={styles.messageBody}>
                    <p>
                      <strong>
                        {msg.sender === name ? "You" : msg.sender}:{" "}
                      </strong>
                      {msg.text}
                    </p>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.typingIndicator}>{typing}</div>

            <div className={styles.inputBox}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>
                SEND <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
