var syms = [];


function ajaxRequest(passedURL, callback)
{
    $.ajax({
          url: passedURL,
          context: document.body
            
            }).success(function(res){
                callback(res);
            });
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
	var suggestion_div = document.getElementById("suggestions");
        while (suggestion_div.firstChild) {
        suggestion_div.removeChild(suggestion_div.firstChild);
    }

    for(i = 0 ; i < response.length; i++)
    {
        var option = document.createElement('option');
        option.innerHTML = response[i].company;
        option.value = response[i].symbol;
        option.id= response[i].company;
        suggestion_div.appendChild(option);   
    }
}


function printJSON(response){
	config = {};
	var results = Papa.parse(response);
    alert(results);
	//var csvContent = "data:text/csv;carset=utf-8";
}


function csvToArray(url){
    var data = $.csv.toObjects(url);
}

function setupURL(stockSyms){
	url = "http://finance.yahoo.com/d/quotes.csv?s="

	for (i = 0; i < stockSyms.length-1; i++)
	{
		url+=stockSyms[i];
		url+="+"
	}
	url += stockSyms[stockSyms.length-1];

	url+= "&f=snpc1a2";

	return url;
}




function readCSV(csvURL){
    
    Papa.parse(csvURL,{
        download:true,
        complete: function(results){
            alert(results);
        }
    });

    // var rawFile = new XMLHttpRequest();
   

    // rawFile.onreadystatechange = function(){
    //     if(rawFile.readyState==4 && rawFile.status == 200)
    //     {
    //         var text = rawFile.responseText;
    //         alert(text);   
    //     }    
    // };
    // rawFile.open("GET", csvURL, true);
   
    // rawFile.send(null);
}


readCSV("http://localhost:8000/src/dailyScript/paypal.csv");