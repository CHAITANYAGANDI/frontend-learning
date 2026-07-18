export type AccountType = "CHEQUING" | "SAVINGS";

export type Account = {
    id: number;
    bankName: string;
    accountType: AccountType;
    accountNumber: number;
    balance: number;
};