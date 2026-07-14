import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";
import SummaryCard from "../components/SummaryCard";
import type {Transaction} from "../types/transaction";
import TransactionRow from "../components/TransactionRow";
import type { DashboardSummary } from "../types/dashboard";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants/auth";
import { getDashboardSummary } from "../services/dashboardService";
import { getRecentTransactions } from "../services/transactionService";
import { formatCurrency } from "../utils/formatCurrency";

const sampleDashboardSummary: DashboardSummary = {

    totalBalance: 4500,
    currentMonthCredit: 2500,
    currentMonthDebit: 1200
};

const sampleTransactions: Transaction[] = [
    {
        id:1,
        title: "Salary",
        amount: 2500,
        type: "CREDIT",
        date: "2026-07-14"
    },
    
    {
        id: 2,
        title: "Groceries",
        amount: 120,
        type: "DEBIT",
        date: "2026-07-13"
    },
    {
        id: 3,
        title: "Savings Transfer",
        amount: 500,
        type: "TRANSFER",
        date: "2026-07-12"
    }
];

function DashboardPage(){

    const navigate = useNavigate();

    const [dashboardSummary,setDashboardSummary] = useState<DashboardSummary>(sampleDashboardSummary);
    const [dashboardMessage, setDashboardMessage] = useState("");
    const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);


    function handleLogout(){

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        navigate("/");
    }

    useEffect(() => {

        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if(!accessToken){
            navigate("/");
            return;
        }

        async function loadDashboardData(accessToken: string){

            try{

                setDashboardMessage("Loading dashboard data...");

                const summaryFromBackend = await getDashboardSummary(accessToken);
                const transactionsFromBackend = await getRecentTransactions(accessToken);

                setDashboardSummary(summaryFromBackend);
                setTransactions(transactionsFromBackend);
                setDashboardMessage("");

            } catch(error){
                console.log("Dashboard data error:", error);
                
                setDashboardSummary(sampleDashboardSummary);
                setTransactions(sampleTransactions);
                setDashboardMessage("Backend is not ready. Showing sample dashboard data.");
            }
        }

        loadDashboardData(accessToken);

    }, [navigate]);

    return (
        <div className="app-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <div>
                        <h1>NorthLedger Dashboard</h1>
                        <p>Welcome to your personal finance dashboard.</p>
                    </div>
                        <button onClick={handleLogout}>Logout</button>
                </div>
                {dashboardMessage && <p className="dashboard-message">{dashboardMessage}</p>}
                <div className="summary-grid">
                    <SummaryCard title="Total Balance" value={formatCurrency(dashboardSummary.totalBalance)}/>
                    <SummaryCard title="Current Month Credit" value={formatCurrency(dashboardSummary.currentMonthCredit)}/>
                    <SummaryCard title="Current Month Debit" value={formatCurrency(dashboardSummary.currentMonthDebit)}/>
                </div>
                <div className="transactions-section">
                    <h2>Recent Transactions</h2>
                    <div className="transactions-list">
                        {transactions.map(transaction => {

                            return(
                                <TransactionRow key={transaction.id} 
                                transaction={transaction}/>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;