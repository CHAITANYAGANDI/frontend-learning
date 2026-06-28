const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(email === "" || password === ""){

        errorMessage.textContent = "Please enter email and password";
        successMessage.textContent = "";
        return;
    }

    if(!email.includes("@")){

        errorMessage.textContent = "Please enter a valid email address";
        successMessage.textContent = "";
        return;
    }

    if(password.length < 6){
        errorMessage.textContent = "Password must be at least 6 characters";
        successMessage.textContent = "";
        return;
    }

    errorMessage.textContent = "";
    successMessage.textContent = "Login details received successfully";

    const loginRequest = {

        email:email,
        password:password
    };


    const loginRequestJson = JSON.stringify(loginRequest);

    fetch("http://localhost:8080/api/v1/auth/login",{

        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: loginRequestJson

    }).then((response)=>{

        if(!response.ok){
            
            errorMessage.textContent = "Invalid email or password";
            successMessage.textContent = "";
            return;
        }

        return response.json();

    }).then((loginResponse) => {

        if(!loginResponse){

            return;
        }

        localStorage.setItem("accessToken",loginResponse.accessToken);

        errorMessage.textContent = "";
        successMessage.textContent = "Login Successful";

        window.location.href = "dashboard.html";

    }).catch((error)=>{

        errorMessage.textContent = "Unable to connect to server. Please try again later.";
        successMessage.textContent = "";

        console.log("Fetch error:",error);
    });
});