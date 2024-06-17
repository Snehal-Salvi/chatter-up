import React, { useState, useEffect } from "react";
import styles from "./Rooms.module.css";
import { BACKEND_URL } from "../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faComment } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader/Loader";

function Rooms({ onSelectRoom }) {
  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [activeRoomId, setActiveRoomId] = useState(null);

  // Fetch rooms from backend on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Function to fetch rooms from backend
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      setError(error.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Handle click on a room to select it
  const handleRoomClick = (room) => {
    setActiveRoomId(room._id);
    onSelectRoom(room);
  };

  // Handle creation of a new room
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRoomName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const newRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewRoomName(""); // Clear the input field
    } catch (error) {
      setError(error.message || "Failed to create room");
    }
  };

  // Handle deletion of a room
  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) return; // Exit if the user cancels

    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }

      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));

      if (activeRoomId === roomId) {
        setActiveRoomId(null);
      }
    } catch (error) {
      setError(error.message || "Failed to delete room");
    }
  };

  // Display loading spinner while loading
  if (loading) {
    return <div className={styles.loader}><Loader/></div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Render room list and create new room input
  return (
    <div className={styles.roomsContainer}>
      <h2 className={styles.heading}>
        Available Rooms <FontAwesomeIcon icon={faComment} />
      </h2>
      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`${styles.room} ${
              room._id === activeRoomId ? styles.activeRoom : ""
            }`}
            onClick={() => handleRoomClick(room)}
          >
            <span>{room.name}</span>
            <FontAwesomeIcon
              icon={faTrash}
              className={styles.deleteIcon}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRoom(room._id);
              }}
            />
          </div>
        ))}
      </div>
      <div className={styles.createRoomContainer}>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter new room name"
          className={styles.createRoomInput}
        />
        <FontAwesomeIcon
          icon={faPlus}
          className={styles.createRoomIcon}
          onClick={handleCreateRoom}
        />
      </div>
    </div>
  );
}

export default Rooms;
