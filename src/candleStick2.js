    var axesCount = 40;
    var width = 900;
    var height = 500;

    var monthFormat = d3.timeFormat("%m/%e");
    var dateFormat = d3.timeFormat("%b-%e-%Y");
    
    // var end = new Date();
    // var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);

    


    function min(a, b){ return a < b ? a : b ; }
    		 		     
    function max(a, b){ return a > b ? a : b; }    

    function buildChart(data){        
      var idCount = 0;
      var increment =  data.length/axesCount;
      var tracker = 3;
      // data = data.map(function(d){
      //   d.date = String(d.date);
      //   d.date = d.date.split(" ");
      //   d.date[3] = d.date[3].substr(2,3);
      //   d.date = d.date[2] + "-" + d.date[1] + "-" + d.date[3];
      //   d.date = dateFormat(d.date);
      //    return {
      //       date: d.date,
      //       open: +d.open,
      //       high: +d.high,
      //       low: +d.low,
      //       close: +d.close,
      //       volume: +d.volume
      //   };
      // });

      var margin = 50;		   
    	  
      var chart = d3.select("#graphLayout")
    	  .append("svg:svg")
    	  .attr("class", "chart")
    	  .attr("width", width)
    	  .attr("height", height);
      var y = d3.scale.linear()
    	  .domain([d3.min(data.map(function(x) {return x["low"];})), d3.max(data.map(function(x){return x["high"];}))])
    	  .range([height-margin, margin]);
      var x = d3.scale.linear()
    	  .domain([d3.min(data.map(function(d){
          return d.date;
        })),
    	  	   d3.max(data.map(function(d){return d.date;}))])
    	  .range([margin,width-margin]);

            chart.selectAll("line.x")
             .data(x.ticks(axesCount))
             .enter().append("svg:line")
             .attr("class", "x")
             .attr("x1", x)
             .attr("x2", x)
             .attr("y1", margin)
             .attr("y2", height - margin)
             .attr("stroke", "#ccc");

            chart.selectAll("line.y")
             .data(y.ticks(10))
             .enter().append("svg:line")
             .attr("class", "y")
             .attr("x1", margin)
             .attr("x2", width - margin)
             .attr("y1", y)
             .attr("y2", y)
             .attr("stroke", "#ccc");

            chart.selectAll("text.xrule")
             .data(x.ticks(axesCount))
             .enter().append("svg:text")
             .attr("class", "xrule")
             .attr("x", x)
             .attr("y", height - margin)
             .attr("dy", 20)
             .attr("text-anchor", "middle")
             .text(function(d){
              var retMonth = monthFormat(data[tracker].date); 
                  tracker = Math.round(tracker + increment);
                  return retMonth;
             });

           chart.selectAll("text.yrule")
            .data(y.ticks(10))
            .enter().append("svg:text")
            .attr("class", "yrule")
            .attr("x", width - margin)
            .attr("y", y)
            .attr("dy", 0)
            .attr("dx", 20)		 
            .attr("text-anchor", "middle")
            .text(String);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    chart.selectAll("rect")
      .data(data)
      .enter().append("svg:rect")
      .attr("id", function(d){
          return ((idCount++).toString());
      })
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) {return y(max(d.open, d.close));})		  
      .attr("height", function(d) { return y(min(d.open, d.close))-y(max(d.open, d.close));})
      .attr("width", function(d) { return 0.5 * (width - 2*margin)/data.length; })
      .attr("fill",function(d) { return d.open > d.close ? "red" : "green" ;})
      .on("mouseover", function(d){
        d3.select(this)
          .style("opacity", 0.5);
        var that = d3.select(this);
        d3.select(("#stem"+ that[0][0].id))
          .style("opacity", 0.2);
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("date:" + dateFormat(d.date) + "<br/>"
                + "high:" + d.high.toString() + "<br/>"
                + "low:" + d.low.toString()+ "<br/>"
                + "volume:" + d.volume.toString())
          .style("left", (d3.event.pageX)+ "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(){
        var that = d3.select(this);
       
        d3.select(("#stem"+ that[0][0].id))
          .style("opacity", 1);
        d3.select(this)
          .style("opacity", 1);
        
        div.style("opacity", 0);
      });
      
      idCount = 0;

      chart.selectAll("line.stem")
        .data(data)
        .enter().append("svg:line")
        .attr("id", function(d){
          return ("stem" + ((idCount++).toString()));
        })
        .attr("class", "stem")
        .attr("x1", function(d) { 
          return x(d.date) + 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d) { 
          return x(d.date) + 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("y1", function(d) { 
          return y(d.high);
        })
        .attr("y2", function(d) {
         return y(d.low); 
        })
        .attr("stroke", function(d){ 
          return d.open > d.close ? "red" : "green"; 
        })
        .on("mouseover", function(d){
          d3.select(this)
            .style("opacity", 0.5);
          var that = d3.select(this);

          d3.select("#" + this.id.replace("stem", ""))
            .style("opacity", 0.5);

          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html("date:" + dateFormat(d.date) + "<br/>"
                  + "high:" + d.high.toString() + "<br/>"
                  + "low:" + d.low.toString()+ "<br/>"
                  + "volume:" + d.volume.toString())
            .style("left", (d3.event.pageX)+ "px")
            .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(){
          d3.select(this)
            .style("opacity", 1);

          var that = d3.select(this);
          d3.select("#" + this.id.replace("stem", ""))
            .style("opacity", 1);

          div.style("opacity", 0);
        });

      idCount = 0;
    }		  

  String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
          var regexp = new RegExp('\\{'+i+'\\}', 'gi');
          formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    }

  function appendToData(x){
  	if(data.length > 0){
  	    return;
          }
          data = x.query.results.quote;
          for(var i=0;i<data.length;i++){
            data[i].timestamp = (new Date(data[i].date).getTime() / 1000);
          }		  
          data = data.sort(function(x, y){ return dateFormat(x.date).getTime() - dateFormat(y.date).getTime(); });			
          buildChart(data);		  
      }

      // function buildQuery(){
      //   var symbol = window.location.hash;
      //   if(symbol === ""){
      //      symbol = "AMZN";
      //   }
      //   symbol = symbol.replace("#", "");		  
      //   var base = "select * from yahoo.finance.historicaldata where symbol = \"{0}\" and startDate = \"{1}\" and endDate = \"{2}\"";
      //   var getDateString = d3.time.format("%Y-%m-%d");
      //   var query = base.format(symbol, getDateString(start), getDateString(end));
      //   query = encodeURIComponent(query);		    
      //   var url = "http://query.yahooapis.com/v1/public/yql?q={0}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=appendToData".format(query);
      //   return url;
      // }