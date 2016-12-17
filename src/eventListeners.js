//handles suggestion box
document.getElementById("tickerInput").addEventListener("keyup", function(event){
    if(event.keyCode == 13){
        syms.push(document.getElementById("tickerInput").value);
        document.getElementById("tickerInput").value='';
    }
    else{
        var entered = document.getElementById("tickerInput");
        var url = "http://chstocksearch.herokuapp.com/api/" + document.getElementById("tickerInput").value;
        ajaxRequest(url, parseJSON);
    }
});



document.getElementById("suggestions").addEventListener("select", function(event){
        var options = document.getElementById("suggestions").options;
});


document.getElementById("submitButton").addEventListener("click", function(){
	if(document.getElementById("tickerInput").value!="")
		syms.push(document.getElementById("tickerInput").value);


    


    for(i = 0; i <syms.length; i++){
        retrieveQuotes(syms[i], '2012-12-31', )
    }
	retrieveQuotes(syms[0]);
	syms = [];
	document.getElementById("tickerInput").value='';
});

document.getElementById("suggestions").addEventListener("change", function(){
    var sel= document.getElementById("suggestions");
    document.getElementById("tickerInput").value =sel.value;
});