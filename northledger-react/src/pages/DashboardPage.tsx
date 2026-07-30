import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { currentMonth, currentYear, sampleAccounts,sampleBudgets,sampleCategories, sampleTransactions } from "../data/sampleNorthLedgerData";
import { clearAuthTokens } from "../utils/authStorage";
import type { Account } from "../types/account";
import type { Category } from "../types/category";
import type { Transaction, TransactionType } from "../types/transaction";
import type { Budget } from "../types/budget";
import type { AppPage } from "../types/page";
import "../App.css";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June"
    
    ,
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

type TransactionFilter = "ALL" | TransactionType;
type ActiveModal = null | "account" | "transaction" | "budget";

function DashboardPage() {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState<AppPage>("dashboard");

    const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
    const [categories] = useState<Category[]>(sampleCategories);
    const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
    const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
    const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>("ALL");
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [newAccountBankName, setNewAccountBankName] = useState<string>("");
    const [newAccountType, setNewAccountType] = useState<Account["accountType"]>("CHEQUING");
    const [newTransactionType, setNewTransactionType] = useState<"DEBIT" | "CREDIT">("DEBIT");
    const [newTransactionAccountId, setNewTransactionAccountId] = useState<number>(accounts[0]?.id ?? 0);
    const [newTransactionAmount, setNewTransactionAmount] = useState<string>("");
    const [newTransactionDescription, setNewTransactionDescription] = useState<string>("");
    const [newTransactionDate, setNewTransactionDate] = useState<string>(new Date().toISOString().slice(0,10));
    const [newBudgetLimit, setNewBudgetLimit] = useState<string>("");


    const expenseCategories = categories.filter((category) => {

        return category.categoryType === "EXPENSE";
    });

    const firstExpenseCategory = expenseCategories[0];

    const [newTransactionCategoryId, setNewTransactionCategoryId] = useState<number>(firstExpenseCategory?.id ?? 0);

    const [newBudgetCategoryId, setNewBudgetCategoryId] = useState<number>(firstExpenseCategory?.id ?? 0);

    
    function handleLogout(){

        clearAuthTokens();
        navigate("/");
    }

    function closeModal(){

        setActiveModal(null);

        setNewAccountBankName("");
        setNewAccountType("CHEQUING");

        resetTransactionForm();
    }

    function handleAddAccount(event: FormEvent<HTMLFormElement>){

        event.preventDefault();

        const trimmedBankName = newAccountBankName.trim();

        if(!trimmedBankName) {
            return;
        }



        setAccounts((currentAccounts) => {

            const nextAccountId = 
                currentAccounts.length === 0
                ? 1
                : Math.max(...currentAccounts.map((account) => account.id)) + 1;


            const newAccount: Account = {

                id: nextAccountId,
                bankName: trimmedBankName,
                accountType: newAccountType,
                accountNumber: 1000000000 + nextAccountId,
                balance: 0
            };
            
            return [...currentAccounts, newAccount];
        });

        closeModal();
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

            return `${getAccountName(transaction.fromAccountId)} to ${getAccountName(transaction.toAccountId)}`;
        }

        return `${getCategoryName(transaction.categoryId)} · ${getAccountName(transaction.accountId)}`;
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
                    <div className="row-date">
                        {dateLabel(transaction.transactionDate)}
                    </div>
                </div>
                
            </div>
        );
    }

    function spentForCategory(categoryId: number): number {
        return transactions
            .filter((transaction)=>{
                return (

                    transaction.transactionType === "DEBIT" &&
                    transaction.categoryId === categoryId &&
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

                </div>
                
                <span className={statusClassName}>{status}</span>

            </div>
        );
    }

    function renderAccountCard(account: Account){
        
        const accountId = account.id;
        const bankName = account.bankName.slice(0,2).toUpperCase();
        const accountType = account.accountType === "CHEQUING" ? "Chequing" : "Savings";
        const accountNumber: string = account.accountNumber.toString();
        const accountBalance = money(account.balance);

        return (
            <div className="account-card" key={accountId}>
                <div className="account-head">
                    <div className="bank-mark">
                        {bankName}
                    </div>
                    <span className="tag">{accountType}</span>
                </div>
                <div className="account-name">
                    {getAccountName(accountId)}
                </div>
                <div className="account-number">
                    {"Account "+accountNumber}
                </div>
                <div className="account-balance">{accountBalance}</div>
            </div>
        );
    }

    function resetTransactionForm(){

        setNewTransactionType("DEBIT");
        setNewTransactionAccountId(accounts[0]?.id ?? 0);
        setNewTransactionCategoryId(firstExpenseCategory?.id ?? 0);
        setNewTransactionAmount("");
        setNewTransactionDescription("");
        setNewTransactionDate(new Date().toISOString().slice(0,10));
    }



    function handleAddTransaction(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        const amount = Number(newTransactionAmount);
        const trimmedDescription = newTransactionDescription.trim();

        if(!newTransactionAccountId){

            alert("Please select an account.");
            return;
        }

        if(!newTransactionCategoryId) {

            alert("Please select a category.")
            return;
        }

        if(Number.isNaN(amount) || amount <=0){

            alert("Please enter a valid amount.");
            return;
        }

        if(!trimmedDescription){

            alert("Please enter a note.");
            return;
        }

        const newTransaction: Transaction = {

            id: Date.now(),
            transactionType: newTransactionType,
            accountId: newTransactionAccountId,
            categoryId: newTransactionCategoryId,
            amount: amount,
            description: trimmedDescription,
            transactionDate: newTransactionDate
        };

        setTransactions((currentTransactions) => {

            return [newTransaction, ...currentTransactions];
        });

        setAccounts((currentAccounts) => {

            return currentAccounts.map((account) => {
                if(account.id !== newTransactionAccountId) {

                    return account;
                }

                const updatedBalance = 
                    
                    newTransactionType === "CREDIT"
                        ? account.balance + amount
                        : account.balance - amount;

                return {
                    ...account,
                    balance: updatedBalance
                };
            });
        });

        resetTransactionForm();
        setTransactionFilter("ALL");
        closeModal();
    }


    const monthlyIncome = currentMonthlyIncome();
    const monthlyExpenses = currentMontlyExpenses();
    const monthlySavings = monthlyIncome - monthlyExpenses;

    const spendingByCategory = getSpendingByCategory();
    const totalSpending = monthlyExpenses;

    const filteredTransactions = transactionFilter === "ALL" 
                                    ? transactions 
                                    : transactions.filter((transaction)=>{

                                        return transaction.transactionType === transactionFilter;
                                    });


    const availableTransactionCategories = categories.filter((category) => {

        if(newTransactionType === "DEBIT") {
            return category.categoryType === "EXPENSE";
        }

        return category.categoryType === "INCOME";
    });

    return (
        <div className="dashboard-app">
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
                        <div className="dashboard-grid">
                            <div>
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
                        </div>  
                    </section>
                )}
                {activePage === "accounts" && (
                    <section className="page active">
                        <div className="topbar">
                            <h1>Account Details</h1>
                            <button 
                                className="btn primary" 
                                onClick={()=>{setActiveModal("account")}}
                                >Add account</button>
                        </div>
                        <div className="cards-grid">
                            {accounts.map(renderAccountCard)}
                        </div>
                    </section>
                )}
                {activePage === "transactions" &&(

                    <section className="page active">
                        <div className="topbar">
                            <div>
                                <h1>Transactions</h1>
                                <p className="subtitle">Review every credit, debit, and transfer</p>
                            </div>
                            
                            <button className="btn primary"
                            onClick={()=>{setActiveModal("transaction")}}>Add transaction</button>
                        </div>

                        <div className="filter-row">
                            <button className={transactionFilter === "ALL" ? "filter active" : "filter"} 
                                    onClick={()=>{setTransactionFilter("ALL")}}>All</button>
                            <button className={transactionFilter === "CREDIT" ? "filter active" : "filter"}
                                    onClick={()=>{setTransactionFilter("CREDIT")}}>Credit</button>
                            <button className={transactionFilter === "DEBIT" ? "filter active" : "filter"}
                                    onClick={()=>{setTransactionFilter("DEBIT")}}>Debit</button>
                            <button className={transactionFilter === "TRANSFER" ? "filter active" : "filter"}
                                    onClick={()=>{setTransactionFilter("TRANSFER")}}>Transfers</button>
                        </div>

                        <div className="panel">
                            <div className="rows">
                                {filteredTransactions.map(renderTransactionRow)}
                            </div>
                        </div>

                    </section>
                )}

                {activePage === "budgets" && (
                    <section className="page active">
                        <div className="topbar">
                            <div>
                                <h1>Spending limits</h1>
                                <p className="subtitle">Monthly category limits for {periodText()}</p>
                            </div>
                            <button className="btn primary"
                            onClick={() => {
                                setActiveModal("budget");
                            }}>
                                Add limit
                            </button>
                        </div>
                        <div className="panel">
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
            {activeModal === "account" && (

                <div className="modal-backdrop">
                    <form className="modal" onSubmit={handleAddAccount}>

                        <div className="modal-head">
                            <h2>Add account</h2>
                            <button type="button"
                            className="btn subtle"
                            onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body form-grid">
                            <div className="form-group">
                                <label htmlFor="bankName">Bank name</label>
                                <input 
                                id="bankName" 
                                type="text"
                                value={newAccountBankName}
                                onChange={(event) => {
                                    setNewAccountBankName(event.target.value);
                                }}
                                autoFocus />
                            </div>

                            <div className="form-group">
                                <label htmlFor="accountType">Account Type</label>
                                <select 
                                    id="accountType"
                                    value={newAccountType}
                                    onChange={(event) => {
                                        setNewAccountType(event.target.value as Account["accountType"]);
                                    }}
                                    >
                                        <option value="CHEQUING">Chequing</option>
                                        <option value="SAVINGS">Savings</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                            type="button"
                            className="btn subtle"
                            onClick={closeModal}>
                                Cancel
                            </button>

                            <button  type="submit" className="btn primary">
                                Save account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeModal === "transaction" && (
                <div className="modal-backdrop">
                    <form className="modal" onSubmit={handleAddTransaction}>
                        <div className="modal-head">
                            <h2>Add transaction</h2>
                            <button
                            type="button"
                            className="btn subtle"
                            onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body form-grid">

                            <div className="form-group">
                                <label htmlFor="transactionType">Type</label>
                                <select 
                                id="transactionType"
                                value={newTransactionType}
                                onChange={(event) => {
                                    const selectedType = event.target.value as "DEBIT" | "CREDIT";

                                    setNewTransactionType(selectedType);

                                    const firstMatchingCategory = categories.find((category) => {

                                        if( selectedType === "DEBIT") {

                                            return category.categoryType === "EXPENSE";
                                        }

                                        return category.categoryType === "INCOME";
                                    });

                                    if(firstMatchingCategory){
                                        setNewTransactionCategoryId(firstMatchingCategory.id);
                                    }
                                }}>
                                    <option value="DEBIT">Debit</option>
                                    <option value="CREDIT">Credit</option>
                                    {/* <option value="TRANSFER">Transfer</option> */}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="account">ACCOUNT</label>
                                <select id="account"
                                value={newTransactionAccountId}
                                onChange={(event) => {
                                    setNewTransactionAccountId(Number(event.target.value))
                                }}>{accounts.map((account)=>{

                                    return (
                                        <option key = {account.id} value={account.id}>{getAccountName(account.id)}</option>
                                    )
                                })}</select>

                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">AMOUNT</label>
                                <input 
                                id="amount" 
                                type="text" 
                                value={newTransactionAmount}
                                onChange={(event) => {
                                    setNewTransactionAmount(event.target.value)
                                }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">CATEGORY</label>
                                <select id="category"
                                value={newTransactionCategoryId}
                                onChange={(event) => {
                                    setNewTransactionCategoryId(Number(event.target.value))
                                }}>{availableTransactionCategories
                                        .map((category) => {
                                            return(
                                                <option 
                                                key = {category.id} 
                                                value={category.id}>{category.categoryName}</option>
                                            );
                                        })}</select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">DATE</label>
                                <input 
                                id = "date"
                                type="date"
                                value={newTransactionDate}
                                onChange={(event) => {
                                    setNewTransactionDate(event.target.value)
                                }} />
                            </div>

                            <div className="form-group full">
                                <label htmlFor="note">NOTE</label>
                                <input 
                                id = "note"
                                type="text"
                                value={newTransactionDescription}
                                onChange={(event) => {
                                    setNewTransactionDescription(event.target.value)
                                }}
                                autoFocus/>
                            </div>
                        </div>

                        <div className="modal-actions">

                            <button type="button"
                            className="btn subtle"
                            onClick={closeModal}
                            > Cancel</button>

                            <button type="submit" className="btn primary"> Save transaction</button>

                        </div>
                    </form>
                </div>
            )}

            {activeModal === "budget" && (
                <div className="modal-backdrop">
                    <form className="modal">
                        <div className="modal-head">
                            <h2>Add spending limit</h2>
                            <button type="button" 
                            className="btn subtle" 
                            onClick={closeModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="category">CATEGORY</label>
                                <select name="" 
                                    id="category" 
                                    value={newBudgetCategoryId} 
                                    onChange={(event) => {
                                        setNewBudgetCategoryId(Number(event.target.value))
                                    }}>

                                        {expenseCategories.map((category) => {

                                            return(<option 
                                            key={category.id} 
                                            value={category.id}>
                                                {category.categoryName}
                                            </option>);
                                        })}
                                    </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="limit">LIMIT</label>
                                <input 
                                    type="number" 
                                    id="limit" 
                                    value={newBudgetLimit}
                                    onChange={(event) => {
                                        setNewBudgetLimit(event.target.value)
                                    }}/>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn subtle" onClick={closeModal}>Cancel</button>
                            <button type= "submit" className="btn primary">Save limit</button>
                        </div>
                    </form>

                </div>
                
            )}
        </div>
    );

}

export default DashboardPage;