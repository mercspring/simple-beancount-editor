const csvFile = document.getElementById("csv-input");
const rulesFile = document.getElementById("rules-input");
const accountsFile = document.getElementById("accounts-input");
let rules = [];
let transactions = [];
let accounts = [];
let currentTransaction = 0;
function appendTransactionsToTable() {
    console.log("appending transactions")
    $('#beancount-table').empty();
    for (let i = 0; i < transactions.length; i++) {
        const transaction = $(`<tr class="transaction-row" data-transaction-number=${i}>
            <td>${transactions[i].Description}</td>
            <td>${transactions[i]["Transaction Date"]}</td>
        </tr>`);

        if (transactions[i].account != 'No Account') {
            transaction.addClass('blue');
        } else {
            transaction.addClass('red');

        }



        $("#beancount-table").append(transaction)

    }
    $(".transaction-row").on("click", function () {
        currentTransaction = $(this).data("transaction-number")
        const transaction = transactions[currentTransaction];
        console.log(transaction, currentTransaction);
        $('#transaction-details .description').val(transaction.Description);
        $('#transaction-details .date').html(transaction["Transaction Date"]);
        $('#transaction-details .amount-one').html((transaction.Amount * -1).toFixed(2));
        $('#transaction-details .amount-two').html((transaction.Amount * 1).toFixed(2));
        // $('.account-one').attr("data-transaction-number", transactionNumber);
        $('#account-select').val(transaction.account);
    })

}

function alphabetizeAccounts(a, b) {
    var nameA = a.toUpperCase(); // ignore upper and lowercase
    var nameB = b.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1; //nameA comes first
    }
    if (nameA > nameB) {
        return 1; // nameB comes first
    }
    return 0;  // names must be equal
}

function populateAccounts() {

    for (let i = 0; i < accounts.length; i++) {
        const option = $(`<option value=${accounts[i]}>${accounts[i]} </option>`)
        $('#account-select').append(option);
    }
}

function populateDrawnAccount() {
    const drawnAccounts = accounts.filter(line => line.match(/Liabilities|Assets/))

    for (let i = 0; i < drawnAccounts.length; i++) {
        const option = $(`<option value=${drawnAccounts[i]}>${drawnAccounts[i]} </option>`)
        $('#drawn-account').append(option);
    }
}

function generateBeancount() {
    let beancountText = '';

    let drawnAccount = $('#drawn-account').val()
    for (let i = 0; i < transactions.length; i++) {
        const date = new Date(transactions[i]["Transaction Date"])
        const beancountTransaction = `${date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2)} * "${transactions[i].Description}"` + '\n' +
            `\t${transactions[i].account}                     ${(transactions[i].Amount * -1).toFixed(2)} USD` + '\n' +
            `\t${drawnAccount}                                ${(transactions[i].Amount * 1).toFixed(2)} USD` + '\n'
        console.log("tranaction", beancountTransaction);

        beancountText += beancountTransaction;

    }
    $('#beancount-output').html(beancountText);
}

$('#generate-beancount').click(function () {
    generateBeancount();
})

$('#drawn-account').on('change', function () {
    $('.account-two').html($('#drawn-account').val())
})

$('#account-select').on('change', function () {

    console.log($(this).val());
    transactions[currentTransaction].account = $('#account-select').val();
    appendTransactionsToTable();
})

$('#transaction-details .description').on('change', function(){
    transactions[currentTransaction].Description = $('#transaction-details .description').val();
    appendTransactionsToTable();
})

// File input Handlers
csvFile.onchange = event => {
    csvFile.files[0].text().then(function (text) {
        console.log(text);
        transactions = $.csv.toObjects(text);
        transactions = transactions.map(transaction => {
            transaction.account = 'No Account';
            if(transaction.Date){
                transaction["Transaction Date"] = transaction.Date
            }
            if(transaction['Posting Date']){
                transaction["Transaction Date"] = transaction["Posting Date"]
            }
            return transaction;
        })

        console.log(transactions);
        appendTransactionsToTable();
    })
}

rulesFile.onchange = event => {
    rulesFile.files[0].text().then(function (text) {
        rules = JSON.parse(text);
    })
}

$('#apply-rules-button').click(function () {
    if (rules.length > 1) {
        console.log('found some rules');
        for (let i = 0; i < transactions.length; i++) {
            for (let j = 0; j < rules.length; j++) {
                const pattern = new RegExp(rules[j].keyword, 'i');
                // console.log(rules[j].keyword, transactions[i].Description)
                if (pattern.test(transactions[i].Description)) {
                    if (rules[j].account != '') {
                        transactions[i].account = rules[j].account;
                        transactions[i].Description = rules[j].description;
                    }
                }
            }
        }

    }
    appendTransactionsToTable();

})

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
        }).filter(line => line).sort(alphabetizeAccounts);
        populateDrawnAccount();
        populateAccounts();

    })
}
