import type {Transaction} from "../types/transaction";
import { formatCurrency } from "../utils/formatCurrency";


type TransactionRowProps = {

    transaction: Transaction;
}

function TransactionRow({transaction}: TransactionRowProps) {

    const transactionTypeClassName = "transaction-type " + transaction.type.toLowerCase();

    return(
        <div className="transaction-row">
            <div>
                <h3>{transaction.title}</h3>
                <p>
                    <span className={transactionTypeClassName}>
                        {transaction.type}
                    </span>
                    <span>
                        . {transaction.date}
                    </span>
                </p>
            </div>
            <strong>{formatCurrency(transaction.amount)}</strong>
        </div>
        
    );
}

export default TransactionRow;