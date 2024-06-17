import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import SignUp from "./Pages/auth/SignUp";
import SignIn from "./Pages/auth/SignIn";
import Home from "./Pages/Home/Home";
import Chat from "./components/Chat/Chat";
import Loader from "./components/Loader/Loader";

function App() {
  // State to manage user authentication status and information
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setUserName(name);
      setIsLoggedIn(true);
    }
    setIsAuthChecked(true);
  }, []);

  // Handle user login
  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem("userName", name);
  };

  // Handle user logout
  const handleLogout = () => {
    setUserName("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  // Render loading spinner until authentication status is checked
  if (!isAuthChecked) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Render application content once authentication is checked
  return (
    <BrowserRouter>
      {/* Application header component */}
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        handleLogout={handleLogout}
      />
      {/* Define application routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />

        {/* Protected route for chat - redirects to signin if not logged in */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              component={<Chat name={userName} />}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Component for protected routes - redirects to signin if not logged in
const ProtectedRoute = ({ isLoggedIn, component }) => {
  return isLoggedIn ? component : <Navigate to="/signin" />;
};

export default App;
