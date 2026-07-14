import type { LoginRequest, LoginResponse } from "../types/auth";
import { LOGIN_URL } from "../constants/api";

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