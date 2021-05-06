const csvFile = document.getElementById("csv-input");
const rulesFile = document.getElementById("rules-input");
let rules = []
let transactions = []

function appendTransactionsToTable() {
    console.log("got to function")
    for(let i = 0; i < transactions.length; i++) {
        console.count("looping")
        const transaction = `<tr data-transaction-number=${i}>
            <td>${transactions[i].Description}</td>
            <td>${transactions[i]["Transaction Date"]}</td>
        </tr>`;
        console.log(transaction);
        $("#beancount-table").append(transaction)

    }

}

csvFile.onchange = event => {
    csvFile.files[0].text().then(function (text) {
        transactions = $.csv.toObjects(text);

        console.log(transactions);
        appendTransactionsToTable();
    })
}

rulesFile.onchange = event => {
    rulesFile.files[0].text().then(function (text) {
        rules = JSON.parse(text);
        console.log(rules);
    })
}