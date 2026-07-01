const API_BASE_URL = "http://localhost:8080/api/v1";
const DASHBOARD_SUMMARY_URL = API_BASE_URL + "/dashboard/summary";
const ACCESS_TOKEN_KEY = "accessToken";


const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

if(!accessToken){

    window.location.href = "index.html";
}

const AUTH_HEADER = "Bearer " + accessToken;

const AUTH_HEADERS = {

    "Authorization": AUTH_HEADER
};

const logoutButton = document.getElementById("logout-button");
const totalBalanceValue = document.getElementById("total-balance-value");
const currentCreditValue = document.getElementById("current-credit-value");
const currentDebitValue = document.getElementById("current-debit-value");
const dashboardMessage = document.getElementById("dashboard-message");


const fakeDashboardSummary = {
    totalBalance:4500,
    currentMonthCredit:2500,
    currentMonthDebit:1200
};


function formatCurrency(amount){
    return "$" + amount.toLocaleString("en-CA",{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateDashboardSummary(dashboardSummary){

    totalBalanceValue.textContent = formatCurrency(dashboardSummary.totalBalance);
    currentCreditValue.textContent = formatCurrency(dashboardSummary.currentMonthCredit);
    currentDebitValue.textContent = formatCurrency(dashboardSummary.currentMonthDebit);
}

function handleUnauthorizedResponse(response){

    if(response.status === 401 || response.status === 403){

        logoutUser();
        return true;
    }

    return false;

}

function showSampleDashboardData(){

    updateDashboardSummary(fakeDashboardSummary);
    dashboardMessage.textContent = "Server is not running. Showing sample dashboard data.";

}

function handleApiResponse(response){

    if (handleUnauthorizedResponse(response)) {
        return;
    }

    if (!response.ok) {
        throw new Error("Failed to load data");
    }

    return response.json();
}

function apiFetch(url){

    
    return fetch(url, {

    method: "GET",
    headers: AUTH_HEADERS
    })
    .then((response) => {

        return handleApiResponse(response);

    }); 
}

async function loadDashboardSummary(){

    dashboardMessage.textContent = "Loading dashboard summary...";

    try{

        const dashboardSummary = await apiFetch(DASHBOARD_SUMMARY_URL);

        if(!dashboardSummary){
            return;
        }

        updateDashboardSummary(dashboardSummary);
        dashboardMessage.textContent = "";
    } catch(error){

        showSampleDashboardData();
        console.log("Dashboard fetch error: ", error);
    }

}

function logoutUser(){

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "index.html";
}


loadDashboardSummary();

logoutButton.addEventListener("click", function(){

logoutUser();

});



