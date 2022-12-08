const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

// let transactions = [
//     { id: 1, name: "Bolo de brigadeiro", amount: -20 },
//     { id: 2, name: "Salário", amount: 300 },
//     { id: 3, name: "Torta de frango", amount: -10 },
//     { id: 4, name: "Violão", amount: 150 }
// ];

const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions"));
let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);

    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? "-" : "+";
    const CSSClass = transaction.amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(transaction.amount);

    const li = document.createElement("li");

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}
        </span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `;

    transactionsUl.append(li);

}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);

const getIncomes = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);


const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);

    // const totalRed = transactionsAmounts
    //     .reduce((accumulator, transaction) => accumulator + transaction, 0)
    //     .toFixed(2);
    const totalRed = getTotal(transactionsAmounts);

    // const income = transactionsAmounts
    //     .filter(value => value > 0)
    //     .reduce((accumulator, value) => accumulator + value, 0)
    //     .toFixed(2);
    const income = getIncomes(transactionsAmounts);

    // const expense = Math.abs(transactionsAmounts
    //     .filter(value => value < 0)
    //     .reduce((accumulator, value) => accumulator + value, 0))
    //     .toFixed(2);

    const expense = getExpenses(transactionsAmounts);

    balanceDisplay.textContent = `R$ ${totalRed}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `- R$ ${expense}`;
}



const init = () => {
    transactionsUl.innerHTML = "";
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

init();


const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}



const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = "";
    inputTransactionAmount.value = "";
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

    if(isSomeInputEmpty){
        alert("Por favor, preencha NOME E VALOR da transação");
        return;
    }

    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener("submit", handleFormSubmit);



