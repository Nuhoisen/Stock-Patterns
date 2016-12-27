    var axesCount = 30;
    var width = 900;
    var height = 500;

    var monthFormat = d3.timeFormat("%m/%e");
    var dateFormat = d3.timeFormat("%b-%e-%Y");
    
    // var end = new Date();
    // var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // var button = d3.select("body").append("button")
    //   .attr("id", "downloadButton")
    //   .style("display", "none")
    //   .text("download chart")
    //   .on("click", function(){
    //       function triggerDownload (imgURI) {
    //         var evt = new MouseEvent('click', {
    //           view: window,
    //           bubbles: false,
    //           cancelable: true
    //         });

    //         var a = document.createElement('a');
    //         a.setAttribute('download', 'MY_COOL_IMAGE.png');
    //         a.setAttribute('href', imgURI);
    //         a.setAttribute('target', '_blank');

    //         a.dispatchEvent(evt);
    //       }
    //       var svg = document.querySelector("svg"),
    //       canvas = document.querySelector("canvas"),
    //       context = canvas.getContext("2d"),
    //       svgData = (new XMLSerializer()).serializeToString(svg),
    //       DOMURL  = window.URL || window.webkitURL || window,
    //       image = new Image(),
    //       svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'}),
    //       url = DOMURL.createObjectURL(svgBlob);

    //       image.onload = function(){
    //         context.drawImage(image, 0, 0);
    //         DOMURL.revokeObjectURL(url);

    //         var imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

    //         triggerDownload(imgURI);
    //       }
    //       image.src = url;
    //   });


    function min(a, b){ return a < b ? a : b ; }
    		 		     
    function max(a, b){ return a > b ? a : b; }    

    function buildChart(data){        
      axesCount = data.length < 30 ? data.length : 30;
      var idCount = 0;
      var increment =  data.length/axesCount;
      var tracker = 3;
      
      d3.selectAll("svg")
        .remove();
      d3.selectAll("tooltip")
        .style("opacity", 0);
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
    	  .domain([data[0].date.getTime(), data[data.length-1].date.getTime()])
        .range([margin,width-margin]);
        
      var volumeY = d3.scale.linear()
        .domain([0, d3.max(data.map(function(de){return de["volume"];}))])
        .range([height-margin, height-400]);


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
              var dayte = new Date(d);
              return dayte.getMonth() + "/" + dayte.getDate();
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



    

    chart.selectAll("rect")
      .data(data)
      .enter().append("svg:rect")
      .attr("id", function(d){
          return ("rect"+(idCount++).toString());
      })
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) {return y(max(d.open, d.close));})		  
      .attr("height", function(d) { return y(min(d.open, d.close))-y(max(d.open, d.close));})
      .attr("width", function(d) { return 0.5 * (width - 2*margin)/data.length; })
      .attr("fill",function(d) { return d.open > d.close ? "red" : "green" ;})
      .on("mouseover", function(d){
        d3.select(this)
          .style("opacity", 0.5);
        d3.select(("#" + this.id.replace("rect", "stem")))
          .style("opacity", 0.2);
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("date:" + dateFormat(d.date) + "<br/>"
                + "open:" + Math.round(d.open*100)/100 + "<br/>"
                + "close:" + Math.round(d.close*100)/100 + "<br/>"
                + "high:" + Math.round(d.high*100)/100 + "<br/>"
                + "low:" + Math.round(d.low*100)/100 + "<br/>"
                + "volume:" + d.volume.toString())
          .style("left", (d3.event.pageX)+ "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(){
       
        d3.select(("#"+ this.id.replace("rect", "stem")))
          .style("opacity", 1);
        d3.select(this)
          .style("opacity", 1);
        
        div.style("opacity", 0);
      });
      
      chart.selectAll("line.stem")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "volumeStem")
        .attr("x1", function(d){
          return x(d.date)+ 0.25 * (width -2 * margin)/data.length;
        })
        .attr("x2", function(d){
          return x(d.date)+ 0.25 * (width -2 * margin)/data.length;
        })
        .attr("y1", function(d){
          return volumeY(d.volume);
        })
        .attr("y2", volumeY(0))
        .attr("stroke", function(d){
          return d.open > d.close ? "red" : "green";
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
         
          d3.select("#" + this.id.replace("stem", "rect"))
            .style("opacity", 0.5);

          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html("date:" + dateFormat(d.date) + "<br/>"
                  + "open:" + d.open.toString() + "<br/>"
                  + "close:" + d.close.toString() + "<br/>"
                  + "high:" + d.high.toString() + "<br/>"
                  + "low:" + d.low.toString()+ "<br/>"
                  + "volume:" + d.volume.toString())
            .style("left", (d3.event.pageX)+ "px")
            .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(){
          d3.select(this)
            .style("opacity", 1);

          d3.select("#" + this.id.replace("stem", "rect"))
            .style("opacity", 1);

          div.style("opacity", 0);
        });

      button.style("display", "block");

      idCount = 0;
    }		  

  // String.prototype.format = function() {
  //       var formatted = this;
  //       for (var i = 0; i < arguments.length; i++) {
  //         var regexp = new RegExp('\\{'+i+'\\}', 'gi');
  //         formatted = formatted.replace(regexp, arguments[i]);
  //       }
  //       return formatted;
  //   }

  // function appendToData(x){
  // 	if(data.length > 0){
  // 	    return;
  //         }
  //         data = x.query.results.quote;
  //         for(var i=0;i<data.length;i++){
  //           data[i].timestamp = (new Date(data[i].date).getTime() / 1000);
  //         }		  
  //         data = data.sort(function(x, y){ return dateFormat(x.date).getTime() - dateFormat(y.date).getTime(); });			
  //         buildChart(data);		  
  //     }

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