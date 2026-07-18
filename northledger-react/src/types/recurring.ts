export type RecurringFrequency = "WEEKLY" | "MONTHLY" | "YEARLY";

export type RecurringExpense = {
    id: number;
    description: string;
    amount: number;
    frequency: RecurringFrequency;
    dueDate: string
};