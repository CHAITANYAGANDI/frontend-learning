const accessToken = localStorage.getItem("accessToken");

if(!accessToken){

    window.location.href = "index.html";
}

const logoutButton = document.getElementById("logout-button");
const totalBalanceValue = document.getElementById("total-balance-value");
const currentCreditValue = document.getElementById("current-credit-value");
const currentDebitValue = document.getElementById("current-debit-value");

const dashboardSummary = {
    totalBalance:4500,
    currentCreditValue:2500,
    currentDebitValue:1200
}


function formatCurrency(amount){
    return "$" + amount.toLocaleString("en-CA",{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


totalBalanceValue.textContent = formatCurrency(dashboardSummary.totalBalance);
currentCreditValue.textContent = formatCurrency(dashboardSummary.currentCreditValue);
currentDebitValue.textContent = formatCurrency(dashboardSummary.currentDebitValue);

logoutButton.addEventListener("click", function(){

    localStorage.removeItem("accessToken");
    window.location.href = "index.html";
});



