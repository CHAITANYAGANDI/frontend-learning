export type TransactionType = "CREDIT" | "DEBIT" | "TRANSFER";

export type Transaction = {
    id: number;
    transactionType: TransactionType;
    accountId?: number;
    categoryId?: number;
    fromAccountId?: number;
    toAccountId?: number;
    amount: number;
    description: string;
    transactionDate: string;
};
