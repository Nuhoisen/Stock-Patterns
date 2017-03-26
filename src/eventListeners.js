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

    var startDate;

 
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+ 1;
    var yyyy=today.getFullYear();

    var margin;

    switch(document.getElementById("daysBack").selectedIndex){
        case 0:
            if(dd>5)
                dd-=5;
            else{
                if(mm>1)
                    mm-=1;
                else{
                    yyyy-=1;   
                    mm = 12;
                }
                dd = 5-dd;
                dd = daysInMonth(mm, yyyy) -dd;          
            }
            margin='d';
            break;

        case 1:
            
            if(dd>20){
                dd-=20;
            }
            else{
                if(mm>1)
                    mm-=1;
                else{   
                    yyyy-=1;
                    mm = 12;  
                }

                dd = 20 - dd;
                dd = daysInMonth(mm, yyyy) -dd;
            }
            margin = 'd';
            break;

        case 2:
            if(document.getElementById("graphSelection").value=="LineGraph")
                dd=100-dd;   //remainder
            else
                dd=50-dd;   //remainder

            var temp;
            do{
                dd= Math.abs(dd);
                if(mm>1)
                    mm-=1;
                else{
                    yyyy-=1;
                    mm = 12;
                }
                temp = daysInMonth(mm, yyyy)
                dd=temp-dd;
            }while(dd<1) 
            margin = 'd';   
            break;
        
        case 3:
            if(document.getElementById("graphSelection").value=="LineGraph")
                dd=250-dd;   //remainder
            else
                dd=200-dd;   //remainder

            var temp;
            do{
                dd= Math.abs(dd);
                if(mm>1)
                    mm-=1;
                else{
                    yyyy-=1;
                    mm = 12;
                }
                temp = daysInMonth(mm, yyyy)
                dd=temp-dd;
            }while(dd<1)
            if(document.getElementById("graphSelection").value=="LineGraph")
                margin = 'd';
            else
                margin = 'w';
            
            break;

        case 4:
            yyyy-=1;
            if(document.getElementById("graphSelection").value=="LineGraph")
                margin = 'd';
            else
                margin = 'w';
            break;
        case 5:
            yyyy-=5;
            if(document.getElementById("graphSelection").value=="LineGraph")
                margin = 'w';
            else
                margin = 'm';
            break;
    }
        if((daysInMonth(mm, yyyy)) == 28 && (dd == 29))
            dd = 28;



    try{
        retrieveQuotes(syms[0], parseDates(dd, mm, yyyy), margin);
    }
    catch(err){
        var sugg = document.getElementById("suggestions");
        retrieveQuotes(sugg.options[sugg.selectedIndex].value, parseDates(dd, mm, yyyy), margin);
    }    
	syms = [];
	//document.getElementById("tickerInput").value='';
});

document.getElementById("suggestions").addEventListener("change", function(){
    var sel= document.getElementById("suggestions");
    document.getElementById("tickerInput").value =sel.value;
});




function parseDates(dd, mm, yyyy){
    if(dd < 10){
      dd = '0' + dd;
    }

    if(mm<10){
      mm= '0' + mm;
    }

    return yyyy +'-'+ mm +'-'+ dd;
}

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}