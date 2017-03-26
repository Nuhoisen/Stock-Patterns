var yahooFinance = require('yahoo-finance');


function retrieveQuotes(symb){
	var todaysDate = CurrentDate();
	yahooFinance.historical({
		symbol: symb,
		from: '2010-01-01',
		to: todaysDate,
		period: 'd'
		},
		function(err, result){
			if(err)
				alert(err);
			else
				patternAnalysis(result);
		}
	);
}