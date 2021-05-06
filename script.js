const csvFile = document.getElementById("csv-input");

csvFile.onchange = event => {
    csvFile.files[0].text().then(function(text){
        console.log(text)
    })
}