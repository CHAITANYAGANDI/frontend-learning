import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants/auth";
import type { LoginRequest } from "../types/auth";
import { loginUser } from "../services/authService";

function LoginPage(){

  const appName = "NorthLedger";
  const subtitle = "Your personal finance dashboard";
  const buttonText = "Login";

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();



  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>){

    
    event.preventDefault();

    if(email.trim() === "" || password.trim() === ""){

      setMessage("Please enter email and password");
      return;
    }

    if(!email.includes("@")){

      setMessage("Please enter a valid email address");
      return;
    }

    if(password.length<6){
      setMessage("Password must be at least 6 characters");
      return;
    }

    const loginRequest: LoginRequest = {

      email: email,
      password: password

    };

    try{

      setMessage("Sending login request...");

      const loginResponse = await loginUser(loginRequest);

      localStorage.setItem(ACCESS_TOKEN_KEY,loginResponse.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, loginResponse.refreshToken);

      setMessage("Login Successful");

      navigate("/dashboard");

    } catch(error){

      console.log("Login error:", error);

      if(error instanceof Error && error.message === "Invalid email or password"){

        setMessage("Invalid email or password");
        return;
      }

      setMessage("Unable to connect to server")
    }

  }

  return(

    <div className="app-container">
      <div className="login-card">
        <h1>{appName}</h1>
        <p>{subtitle}</p>

        <form onSubmit={handleLoginSubmit}>

          <input type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={function(event){
                  setEmail(event.target.value)
                }}/>

          <input type="password"
                placeholder="Enter your password"
                value={password}
                onChange={function(event){
                  setPassword(event.target.value)
                }} />

          <button type="submit">{buttonText}</button>

        </form>

        <p>{message}</p>

      </div>
    </div>
  );
}

export default LoginPage;