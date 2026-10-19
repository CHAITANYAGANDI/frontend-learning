import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { validateRegisterForm } from "../utils/validateRegisterForm";
import { registerUser } from "../services/authService";
import type { RegisterRequest } from "../types/auth";



function RegisterPage(){

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();



    async function handleRegisterSubmit(event:React.FormEvent<HTMLFormElement>){

        event.preventDefault();

        const validationMessage = validateRegisterForm(fullName, email, password, confirmPassword);

        if(validationMessage !== ""){

            setMessage(validationMessage);
            return;
        }

        const registerRequest: RegisterRequest = {

            fullName:fullName,
            email:email,
            password:password,
            confirmPassword:confirmPassword

        };

        try{

            setIsLoading(true);
            setMessage("");

            await registerUser(registerRequest);

            navigate("/");

        } catch(error){

            console.error("Registration error:", error);
            setMessage("Unable to register. Please check your details or try another email.");

        } finally {

            setIsLoading(false);
        }

    }

    

    return(

        <div className="app-container">
            <div className="login-card">
                <h1>Create your account</h1>
                <p>Join Northledger to manage your finances</p>

                <form onSubmit={handleRegisterSubmit}>

                    <input 
                        type="text" 
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(event) => {
                            setFullName(event.target.value);
                        }} />

                    <input 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event)=>{
                            setEmail(event.target.value);
                        }}/>

                    <input 
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event)=>{
                            setPassword(event.target.value);
                        }} />

                    <input 
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(event)=>{
                            setConfirmPassword(event.target.value);
                        }}/>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {message && <p>{message}</p>}

            </div>

        </div>
    )

}

export default RegisterPage;

