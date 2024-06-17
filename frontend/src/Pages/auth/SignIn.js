import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constants.js";
import styles from "./auth.module.css";
import Loader from "../../components/Loader/Loader.js";
import { io } from "socket.io-client";

export default function SignIn({ handleLogin }) {
  // State management
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const socket = io(BACKEND_URL); // Initialize socket connection

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      // Send POST request to login endpoint
      const res = await fetch(`${BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      // Handle successful login
      if (res.ok) {
        // Store token and user name in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);

        // Trigger handleLogin function to update app state
        handleLogin(data.user.name);

        // Connect socket and navigate to chat page
        socket.emit("join-room", "roomName", "previousRoomName");
        navigate("/chat");
      } else {
        // Display error message from server response
        setErrorMessage(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      // Display network error message
      setErrorMessage("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  // Clean up socket connection on component unmount
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]); // Add 'socket' to the dependency array

  // Render sign-in form
  return (
    <div className={styles.authContainer}>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        {/* Display error message if login fails */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        {/* Input fields for email and password */}
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

        {/* Submit button with loading state */}
        <button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Sign In"}
        </button>
      </form>

      {/* Link to sign-up page if user doesn't have an account */}
      <div>
        <span>Don't have an account? </span>
        <Link to="/signup">SignUp</Link>
      </div>
    </div>
  );
}
