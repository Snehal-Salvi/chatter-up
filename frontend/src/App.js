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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setUserName(name);
      setIsLoggedIn(true);
    }
    setIsAuthChecked(true);
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);

    localStorage.setItem("userName", name);
  };

  const handleLogout = () => {
    setUserName("");
    setIsLoggedIn(false);

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  if (!isAuthChecked) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />

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

const ProtectedRoute = ({ isLoggedIn, component }) => {
  return isLoggedIn ? component : <Navigate to="/signin" />;
};

export default App;
