import React, { useState } from "react";
import "./LogIn.css"; // Make sure to adjust the path to your CSS file
import { auth, provider } from "../../firebase/firebase-config";
import { signInWithPopup } from "firebase/auth";

const LogIn = ({ setUser, setIsLoading, setUserInfo }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSignInClick = () => {
    SignInWithGoogle();
  };

  const SignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      localStorage.setItem("user", true);
      const userInfoJson = {
        name: result.user.displayName,
        email: result.user.email,
      };
      const userInfoString = JSON.stringify(userInfoJson);

      localStorage.setItem("userInfo", userInfoString);
      setUser(true);
      setUserInfo(userInfoJson);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <button onClick={handleSignInClick}>with Google</button>
      </form>
    </div>
  );
};

export default LogIn;
