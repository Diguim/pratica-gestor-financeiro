/**
 * Declaracao de variaveis "globais" para manipulação do DOM
 */
const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

/**
 * variáveis e função que manipula o local storage do browser para gravar os dados
 */
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
}

/**
 * Função que trata o valor da transação como positiva ou negativa,
 *  inserindo "- ou +" e a classe "minus ou plus" no html da lista (li)
 *  posteriormente insere no html
 */
const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? "-" : "+";
    const CSSClass = transaction.amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(transaction.amount);

    const li = document.createElement("li");

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}
        </span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`;

    transactionsUl.append(li);
}


/** 
 * 3 funções que tratam os valores de despesas, receitas e o total
*/
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

/**
 * Função que modifica o valor da pagina a partir do "textContent" de informações de funções anteriores
 */
const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);

    const totalRed = getTotal(transactionsAmounts);

    const income = getIncomes(transactionsAmounts);


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

/**
 * Função que trata o preenchimento correto dos inputs
 */
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

/**
 * Chamada do evento a partir do submit do botao e da função que trata o preenchimento dos inputs
 */
form.addEventListener("submit", handleFormSubmit);
