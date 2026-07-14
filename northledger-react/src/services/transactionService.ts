import { RECENT_TRANSACTIONS_URL } from "../constants/api";
import type { Transaction } from "../types/transaction";

export async function getRecentTransactions(accessToken: string): Promise<Transaction[]> {

    const response = await fetch(RECENT_TRANSACTIONS_URL, {
        method:"GET",
        headers:{
            "Authorization": "Bearer " + accessToken
        }
    });

    if(!response.ok){

        throw new Error("Failed to load recent transactions");
    }

    const transactions: Transaction[] = await response.json();

    return transactions;
}