import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import type { LoginRequest } from "../types/auth";
import { loginUser } from "../services/authService";
import { getAccessToken, saveAuthTokens } from "../utils/authStorage";
import { validateLoginForm } from "../utils/validateLoginForm";

function LoginPage(){

  const appName = "NorthLedger";
  const subtitle = "Your personal finance dashboard";
  const buttonText = "Login";

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{

    const accessToken = getAccessToken();

    if(accessToken){
      navigate("/dashboard");
    }

  },[navigate]);


  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>){

    
    event.preventDefault();

    const validationMessage = validateLoginForm(email,password);

    if(validationMessage !== ""){

      setMessage(validationMessage);
      return;
    }

    const loginRequest: LoginRequest = {

      email: email,
      password: password

    };

    try{

      setIsLoading(true);

      setMessage("Sending login request...");

      const loginResponse = await loginUser(loginRequest);

      saveAuthTokens(loginResponse.accessToken,loginResponse.refreshToken);

      setMessage("Login Successful");

      navigate("/dashboard");

    } catch(error){

      console.log("Login error:", error);

      if(error instanceof Error && error.message === "Invalid email or password"){

        setMessage("Invalid email or password");
        return;
      }

      setMessage("Unable to connect to server");

    } finally {

      setIsLoading(false);
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
                onChange={(event) =>{
                  setEmail(event.target.value)
                }}/>

          <input type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>{
                  setPassword(event.target.value)
                }} />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : buttonText}
          </button>

        </form>

        <p>{message}</p>

      </div>
    </div>
  );
}

export default LoginPage;