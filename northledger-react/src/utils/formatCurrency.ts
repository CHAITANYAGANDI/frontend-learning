export function formatCurrency(amount: number): string{

    return "$" + amount.toLocaleString("en-CA",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    });
}