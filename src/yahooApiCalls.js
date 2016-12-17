var yahooFiance = require('yahoo-finance');
/*
run 
	"browserify yahooApiCalls.js -o bundle.js"
*/
function retrieveQuotes(symb, startDate, endDate){
	var todaysDate = CurrentDate();
	yahooFinance.historical({
		symbol: symb,
		from: '2010-01-01',
		to: todaysDate,
		period: 'w'
		},
		function(err, result){
			if(err)
				alert(err);
			else{
				patternAnalysis(result);
			}
		}

	});
}

