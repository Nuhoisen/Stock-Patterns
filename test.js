var syms = [];
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.onerror = function(){
    	alert("nope, not working");
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function httpGetJSON(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.onerror = function(){
    	alert("nope, not working");
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function parseJSON(response){
	var jsonResponse = JSON.parse(response);
    var suggestion_div = document.getElementById("suggestions");
        while (suggestion_div.firstChild) {
        suggestion_div.removeChild(suggestion_div.firstChild);
    }

    for(i = 0 ; i < jsonResponse.length; i++)
    {
        var option = document.createElement('option');
        option.innerHTML = jsonResponse[i].company;
        option.class = "options";
        suggestion_div.appendChild(option);   
    }
}


function printJSON(response){
	config = {};
	var results = Papa.parse(response);

	//var csvContent = "data:text/csv;carset=utf-8";
}
var countries = [
   { value: 'Andorra', data: 'AD' },
   // ...
   { value: 'Zimbabwe', data: 'ZZ' }
];



// $('#tickerInput').autocomplete({
//     source: countries,
//     onSelect: function (suggestion) {
//         alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
//     }
// });



function setupURL(stockSyms){
	url = "http://finance.yahoo.com/d/quotes.csv?s="

	for (i = 0; i < stockSyms.length-1; i++)
	{
		url+=stockSyms[i];
		url+="+"
	}
	url += stockSyms[stockSyms.length-1];

	url+= "&f=snpc1";

	return url;
}

document.getElementById("tickerInput").addEventListener("keyup", function(event){
    if(event.keyCode == 13){
        syms.push(document.getElementById("tickerInput").value);
        document.getElementById("tickerInput").value='';
    }
    else{
        var entered = document.getElementById("tickerInput");
        var url = "http://chstocksearch.herokuapp.com/api/" + document.getElementById("tickerInput").value;
        httpGetJSON(url, parseJSON);
    }


});







document.getElementById("submitButton").addEventListener("click", function(){
	if(document.getElementById("tickerInput").value!="")
		syms.push(document.getElementById("tickerInput").value);

	httpGetAsync(setupURL(syms),printJSON);
	syms = [];
	document.getElementById("tickerInput").value='';
})

