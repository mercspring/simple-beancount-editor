const csvFile = document.getElementById("csv-input");
const rulesFile = document.getElementById("rules-input");
let rules = []

csvFile.onchange = event => {
    csvFile.files[0].text().then(function(text){
        const result = $.csv.toObjects(text);
        console.log(result);
    })
}

rulesFile.onchange = event => {
    rulesFile.files[0].text().then(function(text){
        rules = JSON.parse(text);
        console.log(rules);
    })
}