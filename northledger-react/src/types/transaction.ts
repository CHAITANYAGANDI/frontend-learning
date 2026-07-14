export type TransactionType = "CREDIT" | "DEBIT" | "TRANSFER";

export type Transaction = {
    id: number;
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
};
