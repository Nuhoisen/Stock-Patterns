    var axesCount = 30;
    var width = 900;
    var height = 500;

    var monthFormat = d3.timeFormat("%m/%e");
    var dateFormat = d3.timeFormat("%b-%e-%Y");
    var myYScale;
    var myXScale;
    var twentyDayData = [];
    var fiftyDayData = [];
    var chart = null;
    var data = [];
    // var end = new Date();
    // var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    function min(a, b){ return a < b ? a : b ; }
    		 		     
    function max(a, b){ return a > b ? a : b; }    

    function buildFiftyDayMovingAvg(passedData, maxLength){
      var newDataIndex= 0;
      var newData = [];
      var fiftyIndex = newDataIndex;
      var fiftyDayAvg = 0;
        
      while(newDataIndex<maxLength){
          fiftyIndex = newDataIndex;
          fiftyDayAvg = 0;
          while(fiftyIndex<newDataIndex+50)
              fiftyDayAvg+=passedData[fiftyIndex++].close;

          fiftyDayAvg = fiftyDayAvg/50;
          newData.push(fiftyDayAvg);
          newDataIndex++;
      }
      return newData;
    }

    function buildTwentyDayMovingAvg(passedData, maxLength){

      var startingIndex = 30;
      var newData = [];
      var twentyIndex = 30;
      var twentyDayAvg = 0;
      var count =0;
      while(startingIndex<maxLength-20){
          twentyIndex = startingIndex;
          twentyDayAvg = 0;
          count=0;
          while(count<20)
          {
             twentyDayAvg+=passedData[twentyIndex++].close;
             count++;
          }
          twentyDayAvg = twentyDayAvg/20;
          newData.push(twentyDayAvg);
          startingIndex++;
      }
      return newData;
    }

    function buildLineGraph(passedData){        
      var idCount = 0;
      var tracker = 3;
      data = passedData.slice(50, passedData.length);
      fiftyDayData = buildFiftyDayMovingAvg(passedData, data.length);
      twentyDayData = buildTwentyDayMovingAvg(passedData, passedData.length);
      axesCount = data.length < 20 ? data.length : 20;
      
      d3.selectAll("svg")
        .remove();
      d3.selectAll("tooltip")
        .style("opacity", 0);

      var margin = 50;		   
      var yBottomMargin = 100;
      var xIndex = 0, yIndex = 0;


      myYScale = d3.scale.linear()
    	  .domain([d3.min(passedData.map(function(myXScale) {return myXScale["low"];})), d3.max(passedData.map(function(myXScale){return myXScale["high"];}))])
    	  .range([height-yBottomMargin, margin]);
     
      myXScale = d3.time.scale()
    	  .domain([data[0].date.getTime(), data[data.length-1].date.getTime()])
        .range([margin, width-margin]);
     
      var volumeY = d3.scale.linear()
        .domain([500, d3.max(data.map(function(de){return de["volume"];}))])
        .range([height-margin, height-yBottomMargin]);
     

    chart = d3.select("#graphLayout")
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
      
     
      //volumes
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




      //lineGraph
      chart.selectAll("line.stem")
        .data(data)
        .enter().append("svg:line")
        .attr("id", function(d){
          return ("stem" + ((idCount++).toString()));
        })
        .attr("class", "stem")
        .attr("x1", function(d) { 
          if(xIndex+1==data.length)
            xIndex=1;
          else
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d) { 
          if(xIndex!=data.length)
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("y1", function(d) {
          if(yIndex+1==data.length)
            yIndex=1;
          else 
            return myYScale(data[yIndex++].close);
        })
        .attr("y2", function(d) {
           if(yIndex!=data.length)
            return myYScale(data[yIndex++].close); 
        })
        .attr("stroke", function(d){ 
          return "green"; 
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


        if(document.getElementById("twentyDayCheck").checked==true)
          addTwentyDayAvg();
        if(document.getElementById("fiftyDayCheck").checked==true)
          addFiftyDayAvg();
     
     

      //crossHairs
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

//20 day moving average
function addTwentyDayAvg(){

     var xIndex = 0, yIndex = 1,idCount = 0;
      chart.selectAll("line.twentyDayStem")
        .data(twentyDayData)
        .enter().append("svg:line")
        .attr("id", function(d){
          return ("twentyDayStem" + ((idCount++).toString()));
        })
        .attr("class", "twentyDayStem")
        .attr("x1", function(d) { 
          if(xIndex+1==data.length)
            xIndex=1;
          else
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d) { 
          if(xIndex!=data.length)
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("y1", function(d) {
          return myYScale(d);
            
        })
        .attr("y2", function(d) {
          if(yIndex!=data.length)
            return myYScale(twentyDayData[yIndex++]); 
        })
        .attr("stroke", function(d){ 
          return "red"; 
        })
        .on("mouseout", function(){
          d3.select(this)
            .style("opacity", 1);

          d3.select("#" + this.id.replace("stem", "rect"))
            .style("opacity", 1);

          div.style("opacity", 0);
        });
}

function addFiftyDayAvg(){
    var xIndex = 0, yIndex = 1,idCount = 0;
     
   //50 day moving average
      chart.selectAll("line.fiftyDayStem")
        .data(fiftyDayData)
        .enter().append("svg:line")
        .attr("id", function(d){
          return ("fiftyDayStem" + ((idCount++).toString()));
        })
        .attr("class", "fiftyDayStem")
        .attr("x1", function(d) { 
          if(xIndex+1==data.length)
            xIndex=1;
          else
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("x2", function(d) { 
          if(xIndex!=data.length)
            return myXScale(data[xIndex++].date) ;//+ 0.25 * (width - 2 * margin)/ data.length;
        })
        .attr("y1", function(d) {
          return myYScale(d);
            
        })
        .attr("y2", function(d) {
          if(yIndex!=data.length)
            return myYScale(fiftyDayData[yIndex++]); 
        })
        .attr("stroke", function(d){ 
          return "orange"; 
        })
        .on("mouseout", function(){
          d3.select(this)
            .style("opacity", 1);

          d3.select("#" + this.id.replace("stem", "rect"))
            .style("opacity", 1);

          div.style("opacity", 0);
        });

}