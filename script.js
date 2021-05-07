const csvFile = document.getElementById("csv-input");
const rulesFile = document.getElementById("rules-input");
const accountsFile = document.getElementById("accounts-input");
let rules = [];
let transactions = [];
let accounts = [];

function appendTransactionsToTable() {
    for (let i = 0; i < transactions.length; i++) {
        const transaction = $(`<tr class="transaction-row" data-transaction-number=${i}>
            <td>${transactions[i].Description}</td>
            <td>${transactions[i]["Transaction Date"]}</td>
        </tr>`);
        $("#beancount-table").append(transaction)

    }
    $(".transaction-row").on("click", function () {
        const transaction = transactions[$(this).data("transaction-number")];
        console.log(transaction);
        $('#transaction-details .description').html(transaction.Description)
        $('#transaction-details .date').html(transaction["Transaction Date"])


    })

}

csvFile.onchange = event => {
    csvFile.files[0].text().then(function (text) {
        console.log(text);
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

accountsFile.onchange = event => {
    accountsFile.files[0].text().then(function (text) {
        const linesOfText = text.split('\n');
        console.log(text.split('\n'));
        accounts = linesOfText.map(line => {
            const match = line.match(/(?<=open ).*?(?= )/)
            if (match) {
                return match[0]
            } else {
                return null
            }
        })
        console.log(accounts.filter(line => line))
    })
}
