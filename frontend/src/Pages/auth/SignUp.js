import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constants.js";
import styles from "./auth.module.css";
import Loader from "../../components/Loader/Loader.js";

export default function SignUp() {
  // State management
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      // Send POST request to register user
      const res = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      // Handle registration success or failure
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/signin"); // Redirect to sign-in page on successful registration
      }
    } catch (error) {
      setErrorMessage(error.message); // Handle fetch or JSON parsing error
      setLoading(false);
    }
  };

  // Render sign-up form
  return (
    <div className={styles.authContainer}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        {/* Display error message if registration fails */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {/* Input fields for name, email, and password */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Name"
            id="name"
            onChange={handleChange}
          />
        </div>

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
            placeholder="********"
            id="password"
            onChange={handleChange}
          />
        </div>

        {/* Submit button with loading state */}
        <button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Sign Up"}
        </button>
      </form>

      {/* Link to sign-in page if user already has an account */}
      <div>
        <span>Have an account? </span>
        <Link to="/signin">SignIn</Link>
      </div>
    </div>
  );
}
