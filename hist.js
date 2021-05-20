

var w = 900;
var h = 600;

const margin = {top: 30, right: 20, bottom: 20, left: 30};
const width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

const graphHeight = 500;

const g = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//set up tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("transform", "translate(" + 300+ "," + 200 + ")");



var render = data => {

    //set x and y values
    const xValue = d=>d.bin;
    const yValue = d=>d.avg;

    //create x and y scales
    var xScale =d3.scaleBand()
        .domain(data.map(xValue))
        // .range([0,width/2]);
        .range([0,width]);

    var yScale = d3.scaleLinear()
        .domain([0,d3.max(data,yValue)])
        // .range([0,graphHeight]);
        .range([graphHeight,0]);

    //print axes
    var yAxis = g.append('g').call(d3.axisLeft(yScale))
        .attr("transform", "translate( "+ margin.left + "," + 0 + ")")

    var xAxis = g.append('g').call(d3.axisBottom(xScale).ticks(width/40).tickSizeOuter(0))
        .attr("transform", "translate( "+ margin.left + "," + graphHeight + ")")
        .attr('id', 'xaxis');

// axes labels

    //x axis label
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + 10)
        .text("Average Rides per Hour");

    //y axis label
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -graphHeight/2)
        .text("Number of Stations")


////Create original rects/////

    const rects = g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect');

    rects
        .attr('width', xScale.bandwidth())
        .attr('fill','steelblue')
        .attr('opacity',.7)
        .attr('x', function(d){return xScale(xValue(d))+xScale.bandwidth()+10})
        .attr('y',function(d) { return yScale(yValue(d))})
        .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
        .attr('min', function(d){return d.x0})
        .attr('max',d=>d.x1)
        .attr('stroke', 'white')
        .attr('opacity',.7)
        .on("mouseover", function(d) {

            d3.select(this).
            attr('fill','orange');

            console.log('hello');

            // div.transition()
            //     .duration(200)
            //     .style("opacity", .9)
            //     .attr('fill','orange');
            // div.innerHTML("Range:"+ here.getAttribute("min") + "-"+ here.getAttribute("max") + "<br/>"  + here.getAttribute("num"))
            // // tooltip.html("Jello")
            //     .style("left", 30+ "px")
            //     .style("top", (0) + "px");
        })
        .on("mouseout", function(d) {

            d3.select(this).
            attr('fill','steelblue');

            div.transition()
                .duration(200)
                .style("opacity", 0)
                .attr('fill','orange');
            div.html()
                .style("left", 300+ "px")
                .style("top", (200) + "px");

        });


    /////update functionality/////////
    d3.selectAll(".myRadio").on("change", update);
    update();

    function update(){
        var choices = [];
        //if radio button is clicked, add it to the array of clicked buttons
        d3.selectAll(".myRadio").each(function(d){
          radio=d3.select(this);
          if (radio.property("checked")){
            choices.push(radio.property("value"));
          }
        });

        //if buttons are selected
        if (choices.length >0){
            //if 2 selections are made, filter data for both selections
            if (choices.length == 2){
                 newData = data.filter(function(d){return d.direction == choices[0] &d.period == choices[1] })

           }//else return filtered data for the one selection
            else{
                newData = data.filter(function(d){return d.direction == choices[0]|| d.period == choices[0]})
            }


            //update yScale
            yScale = d3.scaleLinear()
                .domain([0,d3.max(newData,yValue)])
                // .range([0,graphHeight]);
                .range([graphHeight,0]);


            //remove old rectangles from chart
            g.selectAll("rect").remove();

            var boop = g.selectAll('rect')
                .data(newData)

            boop.enter().append('rect')
                .attr('width', xScale.bandwidth())
                .attr('fill','steelblue')
                .attr('stroke', 'white')
                .attr('opacity',.7)
                .attr('bin', d=>d.bin)
                .merge(boop)
                    .attr('x', function(d){return xScale(xValue(d))+(xScale.bandwidth()+10)})
                    .attr('y',function(d) { return yScale(yValue(d))})
                    .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
                    .attr('min', function(d){return d.x0})
                    .attr('max',d=>d.x1)
                    .attr("num", function (d){return d.avg})

                //mouseover functionality
                .on("mouseover", function(d){
                    var workingRect =  d3.select(this)
                    workingRect.
                    attr('fill','orange');

                    //update div
                    div.transition()
                        .duration(200)
                        .style("opacity", .9)
                        .attr('fill','orange');

                    div.html(workingRect.attr("num")+" station(s) had an average of "+workingRect.attr("min")+"-"+workingRect.attr("max")+" rider(s) per hour")
                        .style('left',500+"px")
                        .style("top",  (450)+"px")

            })
                //mouseout functionality
                .on("mouseout", function(d) {
                    d3.select(this).
                    attr('fill','steelblue');

                  thisrect = d3.select(this)._groups[0][0];
                  console.log(thisrect)
                  console.log(thisrect.getAttribute("num"))

                    div.transition()
                        .duration(800)
                        .style("opacity", 0);

                });



           //update the y axis
            yAxis.remove();
            yAxis = g.append('g').call(d3.axisLeft(yScale))
                .attr("transform", "translate( "+ margin.left + "," + 0 + ")")




    }}


}



d3.csv("histData.csv").then(data => {
    data.forEach(d => {
        d.bin = d["Bin"];
        d.period = d['Period'];
        d.direction = d["Direction"];
        d.avg = +d["NumAvg"];
        d.x0 = +d["x0"];
        d.x1 = +d["x1"];
    });

    render (data);
});




