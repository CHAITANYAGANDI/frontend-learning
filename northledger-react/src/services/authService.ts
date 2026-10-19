import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth";
import { LOGIN_URL,REGISTER_URL } from "../constants/api";

export async function loginUser(loginRequest: LoginRequest): Promise<LoginResponse> {

        const loginRequestJson = JSON.stringify(loginRequest);
    
        const response = await fetch(LOGIN_URL,{
    
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:loginRequestJson
          });
    
          if(!response.ok){

            throw new Error("Invalid email or password");
       
          }
    
          const loginResponse: LoginResponse = await response.json();

          return loginResponse;
}


export async function registerUser(registerRequest: RegisterRequest): Promise<RegisterResponse>{


  const registerRequestJson = JSON.stringify(registerRequest);

  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:registerRequestJson
  });


  if(!response.ok){

    throw new Error("Unable to register");
  }

  const registerResponse: RegisterResponse = await response.json();

  return registerResponse;

}