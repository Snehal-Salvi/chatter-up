import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constants.js";
import styles from "./auth.module.css";
import Loader from "../../components/Loader/Loader.js";
import { io } from "socket.io-client";

export default function SignIn({ handleLogin }) {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const socket = io(BACKEND_URL);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);

        handleLogin(data.user.name);

        socket.emit("join-room", "roomName", "previousRoomName");
        navigate("/chat");
      } else {
        setErrorMessage(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Add 'socket' to the dependency array

  return (
    <div className={styles.authContainer}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="abc@email.com"
            id="email"
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="*********"
            id="password"
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Sign In"}
        </button>
      </form>

      <div>
        <span>Don't have an account? </span>
        <Link to="/signup">SignUp</Link>
      </div>
    </div>
  );
}
