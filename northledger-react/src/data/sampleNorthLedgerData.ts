import type { Budget } from "../types/budget";
import type { RecurringExpense } from "../types/recurring";

export const currrentDate = new Date();

export const currentMonth = currrentDate.getMonth() + 1;

export const currentYear = currrentDate.getFullYear();

function iso(day: number): string {

    return `${currentYear}-${String(currentMonth).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

export const sampleAccounts: Account[] = [

    {
        id:1,
        bankName: "TD Bank",
        accountType: "CHEQUING",
        accountNumber: 1000000001,
        balance: 4830.5
    },
    {
        id:2,
        bankName: "RBC Bank",
        accountType: "SAVINGS",
        accountNumber: 1000000002,
        balance: 18240
    }
];

export const sampleCategories: Category[] = [

    {id:1, categoryName: "Rent", categoryType: "EXPENSE"},
    {id:2, categoryName: "Groceries", categoryType: "EXPENSE"},
    { id: 3, categoryName: "Dining", categoryType: "EXPENSE" },
    { id: 4, categoryName: "Transit", categoryType: "EXPENSE" },
    { id: 5, categoryName: "Subscriptions", categoryType: "EXPENSE" },
    { id: 6, categoryName: "Shopping", categoryType: "EXPENSE" },
    { id: 7, categoryName: "Salary", categoryType: "INCOME" },
    { id: 8, categoryName: "Refund", categoryType: "INCOME" },
    { id: 9, categoryName: "Gift", categoryType: "INCOME" },
    { id: 10, categoryName: "Freelance", categoryType: "INCOME" }
];

export const sampleTransactions: Transaction[] = [

    {
        id:1,
        transactionType:"DEBIT",
        accountId:1,
        categoryId:2,
        amount: 86.4,
        description: "Groceries",
        transactiondate: iso(8)
    },
        {
        id: 2,
        transactionType: "DEBIT",
        accountId: 1,
        categoryId: 4,
        amount: 12,
        description: "Transit card",
        transactionDate: iso(7)
    },
    {
        id: 3,
        transactionType: "CREDIT",
        accountId: 1,
        categoryId: 7,
        amount: 2600,
        description: "Paycheque",
        transactionDate: iso(5)
    },
    {
        id: 4,
        transactionType: "DEBIT",
        accountId: 1,
        categoryId: 5,
        amount: 20.99,
        description: "Streaming",
        transactionDate: iso(4)
    },
    {
        id: 5,
        transactionType: "DEBIT",
        accountId: 1,
        categoryId: 3,
        amount: 94.2,
        description: "Dinner",
        transactionDate: iso(3)
    },
    {
        id: 6,
        transactionType: "TRANSFER",
        fromAccountId: 1,
        toAccountId: 2,
        amount: 500,
        description: "Moved to savings",
        transactionDate: iso(2)
    },
    {
        id: 7,
        transactionType: "DEBIT",
        accountId: 1,
        categoryId: 1,
        amount: 1500,
        description: "Rent",
        transactionDate: iso(1)
    }
];

export const sampleBudgets: Budget[] = [

    {id:1, categoryId:3, monthlyLimit:200, month: currentMonth, year: currentYear},
    { id: 2, categoryId: 5, monthlyLimit: 70, month: currentMonth, year: currentYear },
    { id: 3, categoryId: 4, monthlyLimit: 180, month: currentMonth, year: currentYear },
    { id: 4, categoryId: 2, monthlyLimit: 500, month: currentMonth, year: currentYear },
    { id: 5, categoryId: 6, monthlyLimit: 250, month: currentMonth, year: currentYear }
];

export const sampleRecurringExpenses: RecurringExpense[] = [
    {
        id:1,
        description: "Rent",
        amount:1500,
        frequency: "MONTHLY",
        dueDate: iso(28)
    },
    {
        id: 2,
        description: "Phone bill",
        amount: 65,
        frequency: "MONTHLY",
        dueDate: iso(20)
    },
    {
        id: 3,
        description: "Gym",
        amount: 44.99,
        frequency: "MONTHLY",
        dueDate: iso(16)
    }
];
