// // lesson 1 - type inference


// let email: string = "test@gmail.com"; // this is called type inference but no need to mention 
// // :string all the time because typescript automatically know what type of variable it is.

// let password: string = "password123";
// let totalBalance: number = 4500;
// let isLoggedIn: boolean = false;

// console.log(email);
// console.log(password);
// console.log(totalBalance);
// console.log(isLoggedIn);


// // we can't do this because this variable type is number 
// // if you try to assign string here it won't accept

// // totalBalance = "90.99"; 


// // lesson 2 - const vs let


// const appName = "NorthLedger";
// let totallBalance = 4500;

// console.log(appName);
// console.log(totallBalance);

// // you can't assign any new value to the variable that is declared as a constant
// // appName = "newLeger";

// // lesson 3 - function return type and function parameter type

// function formatCurrencyInTs(amount: number): string{

//     return "$" + amount.toLocaleString("en-CA",{

//         minimumFractionDigits:2,
//         maximumFractionDigits:2

//     });

// }

// //Argument type is not matching with the parameter type
// // formatCurrencyInTs("4500");


// // lesson 4 - object types with optional object property

// type dashBoardSummary = {

//     totalNumber: number;
//     currentMonthDebit: number;
//     currentMonthCredit: number;
//     message?: string;
// }


// const dashboardSummary: dashBoardSummary = {
//     totalNumber: 4500,
//     currentMonthCredit: 2500,
//     currentMonthDebit: 1200
// };

// // const dashboardSummary: dashBoardSummary = {
// //     totalNumber: 4500,
// //     currentMonthCredit: 2500,
// //     currentMonthDebit: 1200,
// //     message: "Sameple dashboard data"
// // };



// //type string is not assignable to the type number

// // const dashboardSummary: dashBoardSummary = {
// //     totalBalance: 4500,
// //     currentMonthCredit: 2500,
// //     currentMonthDebit: "1200"// will raise the error
// // };

// //currentMonthDebit property is missing in type - this error will raise 
// // if there are any missing object property

// // const dashboardSummary: dashBoardSummary = {
// //     totalNumber: 4500,
// //     currentMonthCredit: 2500
// // };


// // console.log(dashboardSummary.message);

// if (dashboardSummary.message) {
//     console.log(dashboardSummary.message);
// } else {
//     console.log("No message available");
// }

// // lesson 5 - array

// const accountNames = ["Chequing", "Savings", "Credit card"];

// accountNames.push("Investment");
// console.log(accountNames);

// //Argument type number is not matching with parameter type string

// // accountNames.push(123);


// //lesson 5 - Array of objects

// type Account = {

//     id: number;
//     name: string;
//     type: string;
//     balance: number;
// }

// const accounts: Account[] = [

//     {
//         id:1,
//         name:"Chequing",
//         type:"CHEQUING",
//         balance:4500

//     }
// ];

// //it gives error like type mismatch with defined object property type
// // accounts.push({
// //     id:2,
// //     name:"savings",
// //     type:"SAVINGS",
// //     balance:"5600"
// // });


// //lesson 6 - Union Types

// let accountId: number | string;

// accountId = 1000;
// accountId = "ACC-1000";

// //it doesn't allow boolean values because variable 
// // type is not accepting boolean type values

// // accountId = true;


// //lesson 7 - literal union types

// type DifferentAccount = {
//     id: number;
//     name: string;
//     type: "CHEQUING" | "SAVINGS" | "CREDIT";
//     balance: number;
// };

// // const account: Account = {
// //     id: 1,
// //     name: "Main Chequing",
// //     type: "CHEQUING",
// //     balance: 4500
// // };

// // console.log(account);

// //Below one will raise an error that type loan is not 
// // defined in the DifferentAccount object

// // const account: DifferentAccount = {
// //     id: 1,
// //     name: "Main Account",
// //     type: "LOAN",
// //     balance: 4500
// // };

// // console.log(account);


// // lesson 8 - literal union types with reusable type aliases


// type TransactionType = "CREDIT" | "DEBIT" | "TRANSFER";


// type Transaction = {
    
//     id: number;
//     title: string;
//     amount: number;
//     type: TransactionType
// };

// // Unknown type will not be assigned to the Transaction type
// // const trasaction: Transaction = {

// //     id:1,
// //     title:"Salary",
// //     amount: 2500,
// //     type: "INCOME"
// // };

// // lesson 9 - function parameter using object type

// function printTransaction(transaction: Transaction): void{

//     console.log(transaction.id);
//     console.log(transaction.title);
//     console.log(transaction.amount);
//     console.log(transaction.type);

// }

// const trasaction: Transaction = {

//     id:1,
//     title:"Salary",
//     amount: 2500,
//     type: "DEBIT"
// };


// //Type string is not assignable to the type number
// printTransaction(trasaction);

// // printTransaction({

// //     id:1,
// //     title:"Salary",
// //     amount: "2500",
// //     type: "DEBIT"
// // });

// //lesson 10 - optional chaining

// type User = {
    
//     id: number;
//     name: string;
//     email?: string;
// };

// const user: User =  {

//     id:1,
//     name:"Chaitanya",
//     email: "test@gmail.com"
// };

// // console.log(user.email.toUpperCase());
// console.log(user.email?.toUpperCase());

// // lesson 11 - null and undefined


// let selectedAccount: string | null = null;

// console.log(selectedAccount);

// selectedAccount = "Chequing";

// console.log(selectedAccount);

// // type mismatch error
// // selectedAccount = 123;

// //lesson 12 - type narrowing

// function printSelectedAccount(selectedAccountForTn: string | null): void{

//     if (selectedAccountForTn !== null) {
//     console.log(selectedAccountForTn.toUpperCase());
//     } else {
//         console.log("No account selected");
//     }

// }


// printSelectedAccount(null);
// printSelectedAccount("chequing");

// // lesson 13 - dom elements in typescript

// const emailInputTs = document.getElementById("email") as HTMLInputElement | null;

// if(emailInputTs !== null){

//     const email = emailInputTs.value.trim();
//     console.log(email);

// }else{

//     console.log("Email input not found");
// }

// // lesson 14 - non null assertion "!"

// const emailInp = document.getElementById("email")! as HTMLInputElement

// const testEmail = emailInp.value.trim();

// console.log(testEmail);

// // lesson 15 - API Response types


// type LoginResponse = {

//     accessToken: string;
//     refreshToken: string;
// }

// const loginResponse: LoginResponse = {

//     accessToken: "access-token",
//     refreshToken: "refresh-token"
// }

// // the below code gives you mismatch error

// // const loginResponse: LoginResponse = {

// //     accessToken: "access-token",
// //     refreshToken: 123
// // }


// // lesson 16 -  a function with  return object

// function getLoginResponse(): LoginResponse{

//     return{

//         accessToken: "access-token",
//         refreshToken: "refresh-token"
//     };
// }

// const response = getLoginResponse();

// console.log(response.accessToken);


// // lesson 17 - a function parameter with loginRequest

// type LoginRequest = {

//     email:string;
//     password:string;
// };

// function sendLoginRequest(loginRequest: LoginRequest){

//     return{

//         email:loginRequest.email,
//         password:loginRequest.password
        
//     }

// }

// const loginRequest:LoginRequest = {

//     email: "test@gmail.com",
//     password: "password123"
// };


// const loginRequestJson: string = JSON.stringify(
//     sendLoginRequest(loginRequest));

// console.log(loginRequestJson);

// // lesson 18 - Async func return type


// async function loginUser(): Promise<LoginResponse> {

//     return{

//         accessToken: "acccess-token",
//         refreshToken: "refresh-token"
//     };
// }

// async function runLogin(): Promise<void> {

//     const response = await loginUser();

//     console.log(response.accessToken);
//     console.log(response.refreshToken);
// }


// runLogin();


// // lesson 19 - map() with typed arrays



// accounts.map((account)=> {
//     console.log(account.name);
//     console.log(account.balance);
// });

// // lesson 20 - filter() with type arrays

// const transactions: Transaction[] = [

//     {
//         id:1,
//         title:"salary",
//         amount: 2500,
//         type: "CREDIT"
//     },
//     {
//         id:2,
//         title:"groceries",
//         amount: 120,
//         type: "DEBIT"
//     },
//     {
//         id: 3,
//         title: "Gas",
//         amount: 80,
//         type: "DEBIT"
//     },
//     {
//         id:4,
//         title:"Savings transfer",
//         amount:500,
//         type:"TRANSFER"
//     }
// ];

// const debitTransactions = transactions.filter((trasaction)=>{

//     return trasaction.type === "DEBIT";

// });

// console.log(debitTransactions);


// // lesson 21 - reduce() with typed arrays

// const totalDebit = transactions.filter((transaction)=>{

//     return transaction.type === "DEBIT";
// })
// .reduce((total,transaction)=>{

//     return total+transaction.amount;
// },0);

// console.log(totalDebit);


type TransactionType = "CREDIT"|"DEBIT"|"TRANSFER";


type Transaction = {

    id:number;
    title: string;
    amount: number;
    type: TransactionType;
};

function calculateTotalDebit(transactions: Transaction[]): number {

    const totalDebit = transactions.filter((transaction)=>{

        return transaction.type === "DEBIT";
    
    }).reduce((total,transaction)=>{

        return total+transaction.amount;
    
    },0);

    return totalDebit;
}

const transactions: Transaction[] = [

    {
        id:1,
        title:"salary",
        amount:2500,
        type:"CREDIT"
    },
    {
        id:2,
        title:"groceries",
        amount:120,
        type:"DEBIT"
    },
    {
        id:3,
        title:"gas",
        amount: 80,
        type:"DEBIT"
    }
];

console.log(calculateTotalDebit(transactions));

