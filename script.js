const csvFile = document.getElementById("csv-input");
const rulesFile = document.getElementById("rules-input");
let rules = []
let transactions = []

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
