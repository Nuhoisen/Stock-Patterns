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

    function min(a, b){ return a < b ? a : b ; }
    		 		     
    function max(a, b){ return a > b ? a : b; }    

    function buildCandlestick(data){        
      axesCount = data.length < 25 ? data.length : 25;
      var idCount = 0;
      var increment =  data.length/axesCount;
      var tracker = 3;
      
      d3.selectAll("svg")
        .remove();
      d3.selectAll("tooltip")
        .style("opacity", 0);

      var margin = 50;		   
      var yBottomMargin = 100;
     
      var myYScale = d3.scale.linear()
    	  .domain([d3.min(data.map(function(myXScale) {return myXScale["low"];})), d3.max(data.map(function(myXScale){return myXScale["high"];}))])
    	  .range([height-yBottomMargin, margin]);
      var myXScale = d3.time.scale()
    	  .domain([data[0].date.getTime(), data[data.length-1].date.getTime()])
        .range([margin, width-margin]);
      var xDataScale= d3.scale.linear()
          .domain([data[0], data[data.length-1]])
          .range([margin, width-margin]);

      var volumeY = d3.scale.linear()
        .domain([500, d3.max(data.map(function(de){return de["volume"];}))])
        .range([height-margin, height-yBottomMargin]);
     

      var chart = d3.select("#graphLayout")
        .append("svg:svg")
        .attr("class", "chart")
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", function(){
          var localCoords = d3.mouse(this)
          d3.select("#crossHairX")
            .attr("y1", localCoords[1])
            .attr("y2", localCoords[1]);

          d3.select("#crossHairY")
            .attr("x1", localCoords[0])
            .attr("x2", localCoords[0]); 
        });

      function showCoords(event) {
        var myXScale = event.clientX;
        var myYScale = event.clientY;
      }

        chart.selectAll("line.myXScale")
           .data(myXScale.ticks(axesCount))
           .enter().append("svg:line")
           .attr("class", "myXScale")
           .attr("x1", myXScale)
           .attr("x2", myXScale)
           .attr("y1", margin)
           .attr("y2", height - yBottomMargin)
           .attr("stroke", "#ccc");

          chart.selectAll("line.myYScale")
           .data(myYScale.ticks(10))
           .enter().append("svg:line")
           .attr("class", "myYScale")
           .attr("x1", margin)
           .attr("x2", width - margin)
           .attr("y1", myYScale)
           .attr("y2", myYScale)
           .attr("stroke", "#ccc");

          chart.selectAll("line.voly")
            .data(volumeY.ticks(2))
            .enter().append("svg:line")
            .attr("class", "voly")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", volumeY)
            .attr("y2", volumeY)
            .attr("stroke", "#ccc")
            .attr("stroke-dasharray", "5, 5");

          chart.selectAll("text.xrule")
           .data(myXScale.ticks(axesCount))
           .enter().append("svg:text")
           .attr("class", "xrule")
           .attr("x", myXScale)
           .attr("y", height - margin)
           .attr("dy", 20)
           .attr("text-anchor", "middle")
           .attr("font-size", "8px")
           .text(function(d){
              var dayte = new Date(d);
              return dayte.getMonth()+1 + "/" + dayte.getDate();
           });

          chart.selectAll("text.yrule")
          .data(myYScale.ticks(10))
          .enter().append("svg:text")
          .attr("class", "yrule")
          .attr("x", width - margin+15)
          .attr("y", myYScale)
          .attr("dy", 0)
          .attr("dx", 20)		 
          .attr("text-anchor", "middle")
          .text(String);


          chart.selectAll("text.volyrule")
            .data(volumeY.ticks(2))
            .enter().append("svg:text")
            .attr("class", "volyrule")
            .attr("x", width - margin  + 15)
            .attr("y", volumeY)
            .attr("dy", 0)
            .attr("dx", 20)
            .attr("text-anchor", "middle")
            .text(function(d){
                return (d/1000000)+ "mil";
            });
    

    chart.selectAll("rect")
      .data(data)
      .enter().append("svg:rect")
      .attr("id", function(d){
          return ("rect"+(idCount++).toString());
      })
      .attr("myXScale", function(d) { 
        return myXScale(d.date)-((0.5 * (width - 2*margin)/data.length)/2); 
      })
      .attr("myYScale", function(d) {return myYScale(max(d.open, d.close));})		  
      .attr("height", function(d) { return myYScale(min(d.open, d.close))-myYScale(max(d.open, d.close));})
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
         return myXScale(d.date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d){
        return myXScale(d.date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
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
          return myXScale(d.date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d) { 
          return myXScale(d.date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("y1", function(d) { 
          return myYScale(d.high);
        })
        .attr("y2", function(d) {
         return myYScale(d.low); 
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


      chart.append("svg:line")
        .attr("id", "crossHairX")
        .attr("x1", margin)
        .attr("x2", width-margin)
        .attr("stroke", "#333333")
        .attr("stroke-dasharray", "5, 5");


      chart.append("svg:line")
        .attr("id", "crossHairY")
        .attr("y1", margin)
        .attr("y2", height-margin)
        .attr("stroke", "#333333")
        .attr("stroke-dasharray", "5, 5");
    //  button.style("display", "block");

      idCount = 0;
    }		  

