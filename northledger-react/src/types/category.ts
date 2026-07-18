export type CategoryType = "EXPENSE" | "INCOME";

export type Category = {
    id: number;
    categoryName: string;
    categoryType: CategoryType;
};