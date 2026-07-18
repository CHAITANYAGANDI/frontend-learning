import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currentMonth, currentYear, sampleAccounts,sampleBudgets,sampleCategories, sampleRecurringExpenses, sampleTransactions } from "../data/sampleNorthLedgerData";
import type { RecurringExpense } from "../types/recurring";
import { clearAuthTokens } from "../utils/authStorage";
import type { Account } from "../types/account";
import type { Category } from "../types/category";
import type { Transaction,TransactionType } from "../types/transaction";
import type { Budget } from "../types/budget";
import type { AppPage } from "../types/page";
import "../App.css";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

type TransactionFilter = "ALL" | TransactionType;

function DashboardPage() {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState<AppPage>("dashboard");
    const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>("ALL");

    const [accounts] = useState<Account[]>(sampleAccounts);
    const [categories] = useState<Category[]>(sampleCategories);
    const [transactions] = useState<Transaction[]>(sampleTransactions);
    const [budgets] = useState<Budget[]>(sampleBudgets);
    const [recurringExpenses] = useState<RecurringExpense[]>(sampleRecurringExpenses);

    function handleLogout(){

        clearAuthTokens();
        navigate("/");
    }

    function money(amount: number): string {

        return amount.toLocaleString("en-CA",{
            style: "currency",
            currency: "CAD"
        });
    }

    function periodText(): string {

        return `${monthNames[currentMonth - 1]} ${currentYear}`;
    }

    function inCurrentMonth(transaction: Transaction): boolean {

        const transactionDate = new Date(transaction.transactionDate + "T00:00:00");

        return (
            transactionDate.getMonth() + 1 === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );
    }

    function netWorth(): number {

        return accounts.reduce((total,account)=>{
            return total + account.balance;
        },0);
    }

    function currentMonthlyIncome(): number {

        return transactions.filter((transaction)=>{

            return transaction.transactionType === "CREDIT" && inCurrentMonth(transaction);
        })
        .reduce((total,transaction)=>{
            return total + transaction.amount;
        },0);
    }

    function currentMontlyExpenses(): number {

        return transactions.filter((transaction)=>{

            return transaction.transactionType === "DEBIT" && inCurrentMonth(transaction);

        })
        .reduce((total,transaction)=>{

            return total + transaction.amount;
        },0);
    }

    function getSpendingByCategory() {

        const spendingMap = new Map<string, number>();

        transactions
            .filter((transaction)=>{
                return transaction.transactionType === "DEBIT" && inCurrentMonth(transaction);
            })
            .forEach((transaction)=>{

                const categoryName = getCategoryName(transaction.categoryId);
                const currentAmount = spendingMap.get(categoryName) || 0;

                spendingMap.set(categoryName, currentAmount + transaction.amount);

            });
        
        return Array.from(spendingMap.entries())
            .map(([categoryName, amount])=>{

                return{
                    categoryName: categoryName,
                    amount: amount
                };
            })
            .sort((a,b)=>{
                return b.amount - a.amount;
            });
    }

    function getAccountName(accountId?: number): string {

        const account = accounts.find((account)=>{

            return account.id === accountId;
        });

        if(!account){
            return "Account";
        }

        const accountTypeLabel = account.accountType === "CHEQUING" ? "Chequing" : "Savings";

        return `${account.bankName} ${accountTypeLabel}`;
    }

    function getCategoryName(categoryId?: number): string {

        const category = categories.find((category)=>{
            return category.id === categoryId;
        });

        if(!category){
            return "Category";
        }

        return category.categoryName;
    }

    function dateLabel(date: string): string {

        return new Date(date + "T00:00:00").toLocaleDateString("en-CA",{
            month: "short",
            day: "numeric"
        });
    }

    function getTransactionSubtitle(transaction: Transaction): string {

        if(transaction.transactionType === "TRANSFER") {

            return `${getAccountName(transaction.fromAccountId)} tp ${getAccountName(transaction.toAccountId)}`;
        }

        return `${getCategoryName(transaction.categoryId)} . ${getAccountName(transaction.accountId)}`;
    }

    function getTransactionAmountClass(transaction: Transaction): string {

        if(transaction.transactionType === "CREDIT"){
            return "positive";
        }

        if(transaction.transactionType === "DEBIT"){

            return "negative";
        }

        return "blue";
    }

    function getTransactionAmountLabel(transaction: Transaction): string {

        if(transaction.transactionType === "CREDIT"){

            return "+" + money(transaction.amount);
        }

        if(transaction.transactionType === "DEBIT"){

            return "-" + money(transaction.amount);
        }

        return money(transaction.amount);
    }

    function renderTransactionRow(transaction: Transaction) {

        return(
            <div className="row" key={transaction.id}>
                <div>
                    <div className="row-title">{transaction.description}</div>
                    <div className="row-sub">{getTransactionSubtitle(transaction)}</div>
                </div>
                <div className={"row-amount " + getTransactionAmountClass(transaction)}>
                    {getTransactionAmountLabel(transaction)}
                </div>
                <div className="row-date">
                    {dateLabel(transaction.transactionDate)}
                </div>
            </div>
        );
    }

    function spentForCategory(categoryId: number): number {
        return transactions
            .filter((transaction)=>{
                return (

                    transaction.transactionType === "DEBIT" &&
                    transactionFilter.categoryId === categoryId &&
                    inCurrentMonth(transaction)
                );
            })
            .reduce((total, transaction)=>{
                
                return total + transaction.amount;
            },0);
    }

    function renderBudgetProgress(budget: Budget){

        const spent = spentForCategory(budget.categoryId);
        const rawPercent = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
        const displayPercent = Math.min(100,rawPercent);

        let status = "ON_TRACK";
        let statusClassName = "status";

        if(rawPercent > 100){

            status = "EXCEEDED";
            statusClassName = "status exceeded";
        }else if (rawPercent === 100) {

            status = "LIMIT_REACHED";
            statusClassName = "status limit";
        }

        return(

            <div className="progress-item" key={budget.id}>
                <div className="progress-top">
                    <strong>{getCategoryName(budget.categoryId)}</strong>
                    <span>
                        {money(spent)}/{money(budget.monthlyLimit)}
                    </span>
                </div>

                <div className="progress-track">
                    <div 
                    className="progress-fill"
                    style={{width: `${displayPercent}%`}}>

                    </div>

                    <span className={statusClassName}>{status}</span>
                </div>
            </div>
        );
    }

    const monthlyIncome = currentMonthlyIncome();
    const monthlyExpenses = currentMontlyExpenses();
    const monthlySavings = monthlyIncome - monthlyExpenses;

    const spendingByCategory = getSpendingByCategory();
    const totalSpending = monthlyExpenses;

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">
                    <div className="mark">
                        NL
                    </div>
                    <div className="brand-copy">
                        <div className="brand-title">NorthLedger</div>
                    </div>
                </div>

                <nav className="nav" aria-label="Main navigation">
                    <button 
                    className={activePage === "dashboard" ? "nav-btn active" : "nav-btn"}
                    onClick={()=>{setActivePage("dashboard")}} >
                        Overview
                    </button>
                    <button
                    className={activePage === "accounts" ? "nav-btn active" : "nav-btn"}
                    onClick={()=>{setActivePage("accounts")}}>    
                        Accounts
                    </button>
                    <button
                    className={activePage === "transactions" ? "nav-btn active" : "nav-btn"}
                    onClick={()=>{setActivePage("transactions")}}>
                        Transactions
                    </button>
                    <button
                    className={activePage === "budgets" ? "nav-btn active" : "nav-btn"}
                    onClick={()=>{setActivePage("budgets")}}>
                        Spending limits
                    </button>
                    <button
                    className={activePage === "recurring" ? "nav-btn active" : "nav-btn"}
                    onClick={()=>{setActivePage("recurring")}}>
                        Recurring expenses
                    </button>
                </nav>

                <div className="logout-only">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>Log out</span>
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </aside>

            <main className="main">
                {activePage === "dashboard" && (
                    <section className="page active">
                        <div className="topbar">
                            <div>
                                <h1>Welcome back, Chaitanya</h1>
                                <p className="subtitle">
                                    Here is where your money stands as of {periodText()}
                                </p>
                            </div>
                        </div>

                        <div className="metrics">
                            <div className="metric-card">
                                <div className="metric-label">
                                    Total balance of all time
                                </div>
                                <div className="metric-value">
                                    {money(netWorth())}
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">
                                    Credit amount
                                </div>
                                <div className="metric-value positive">
                                    {money(monthlyIncome)}
                                </div>
                                <div className="metric-note">
                                    For {periodText()}
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">
                                    Debit amount
                                </div>
                                <div className="metric-value negative">
                                    {money(monthlyExpenses)}
                                </div>
                                <div className="metric-note">
                                    For {periodText()}
                                </div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-label">
                                    Current savings
                                </div>
                                <div className="metric-value">
                                    {money(monthlySavings)}
                                </div>
                                <div className="metric-note">
                                    {periodText()}
                                </div>
                            </div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2>
                                        Your Top Spending Categories
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="spending-card">
                                <div className="ring">
                                    <div className="ring-text">
                                        <strong>{money(totalSpending).replace(".00","")}</strong>
                                        <span>spent</span>
                                    </div>
                                </div>
                            </div>

                            <div className="legend-list">
                                {spendingByCategory.length === 0 &&  (
                                    <div className="helper">No spending this month</div>
                                )}

                                {spendingByCategory.map((item,index) => {

                                    const percent =
                                        totalSpending > 0
                                            ? Math.round((item.amount / totalSpending) * 100)
                                            : 0;

                                    return(

                                        <div className="legend-row" key = {item.categoryName}>
                                            <div className="legend-title">
                                                <span className={"swatch swatch-" + index}/>
                                                {item.categoryName}
                                            </div>

                                            <div className="legend-value">
                                                {money(item.amount)}
                                                <small>{percent}%</small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2>Recent activity</h2>
                                </div>
                                <button className="btn subtle"
                                onClick={()=>{
                                    setActivePage("transactions")
                                }}>
                                    View all
                                </button>
                            </div>
                            <div className="rows">
                                {transactions.slice(0,5).map(renderTransactionRow)}
                            </div>
                        </div>

                        <div className="panel">

                            <div className="panel-header">
                                <div>
                                    <h2>
                                        Your Budget Progress
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="progress-list">
                                {budgets.length === 0 && (
                                    <div className="helper">No plans for this month.</div>

                                )}

                                {budgets.map(renderBudgetProgress)}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );

}

export default DashboardPage;