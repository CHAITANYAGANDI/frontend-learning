const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

const ACCESS_TOKEN_KEY = "accessToken";
const API_BASE_URL = "http://localhost:8080/api/v1";
const LOGIN_URL = API_BASE_URL + "/auth/login";
const AUTH_HEADERS = {

    "Content-Type":"application/json"
};

function manageLoginResponse(loginResponse){

        localStorage.setItem(ACCESS_TOKEN_KEY,loginResponse.accessToken);

        errorMessage.textContent = "";
        successMessage.textContent = "Login Successful";

        window.location.href = "dashboard.html";
}

function handleFieldValidation(email,password){

    if(email === "" || password === ""){

        errorMessage.textContent = "Please enter email and password";
        successMessage.textContent = "";
        return false;
    }

    if(!email.includes("@")){

        errorMessage.textContent = "Please enter a valid email address";
        successMessage.textContent = "";
        return false;
    }

    if(password.length < 6){
        errorMessage.textContent = "Password must be at least 6 characters";
        successMessage.textContent = "";
        return false;
    }

    return true;

}

function handleApiResponse(response){

    if(!response.ok){
        
        errorMessage.textContent = "Invalid email or password";
        successMessage.textContent = "";
        return;
    }

    return response.json();
}

function apiFetch(url,requestBody){

    return fetch(url,{

        method:"POST",
        headers: AUTH_HEADERS,
        body: requestBody

    }).then((response) =>{

        if(!response){
            return;
        }
        return handleApiResponse(response);
    })
}


loginForm.addEventListener("submit", async function(event){

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(!handleFieldValidation(email,password)){

        return;
    }

    errorMessage.textContent = "";
    successMessage.textContent = "Sending login request...";

    const loginRequest = {

        email:email,
        password:password
    };


    const loginRequestJson = JSON.stringify(loginRequest);


    try{

        const loginResponseFromServer = await apiFetch(LOGIN_URL,loginRequestJson);

        if(!loginResponseFromServer){
            return;
        }

        manageLoginResponse(loginResponseFromServer);


    } catch(error){

        errorMessage.textContent = "Unable to connect to server. Please try again later.";
        successMessage.textContent = "";

        console.log("Fetch error:",error);
    };
});