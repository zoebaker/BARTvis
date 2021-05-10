

var w = 1100;
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

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("transform", "translate(" + 300+ "," + 200 + ")");

// var div = g.append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 1)
//     .attr('fill','blue')
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var render = data => {
    const xValue = d=>d.bin;
    const yValue = d=>d.avg;

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

    // g.append('g').call(d3.axisLeft(yScale))
    //     .attr("transform", "translate( "+ margin.left + "," + 0 + ")")

    // g.append('g').call(yAxis)
    //     .attr("transform", "translate( "+ margin.left + "," + 0 + ")")
    //     .attr('id', 'yaxis')
    //
    // g.append('g').call(d3.axisBottom(xScale).ticks(width/40).tickSizeOuter(0))
    //     .attr("transform", "translate( "+ margin.left + "," + graphHeight + ")")
    //     .attr('id', 'xaxis');
        // .attr("text-anchor", "end")

// axes labels

    //x axis label
    g.append("text")
        .attr("text-anchor", "midde")
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
        .attr('x', function(d){return xScale(xValue(d))+xScale.bandwidth()})
        .attr('y',function(d) { return yScale(yValue(d))})
        .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
        .append('title').text(d=>d.avg)
        .attr('min', function(d){return d.x0})
        .attr('max',d=>d.x1)
        .attr('opacity',.7)
        .on("mouseover", function(d) {

            d3.select(this).
            attr('fill','orange');

            console.log('hello');

            div.transition()
                .duration(200)
                .style("opacity", .9)
                .attr('fill','orange');
            div.innerHTML("Range:"+ here.getAttribute("min") + "-"+ here.getAttribute("max") + "<br/>"  + here.getAttribute("num"))
            // tooltip.html("Jello")
                .style("left", 30+ "px")
                .style("top", (0) + "px");
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

    var postpan = data.filter(function(d){return d.bin == 1 & d.period=='during' & d.direction == "origin"})

    var test = document.getElementById('destination');
    console.log(xScale(postpan[0].bin)+xScale.bandwidth())



    var annotationBoxHeight = 40;


    ////DIY Annotation Box///

    // console.log(postpan[0])
    // const duringOriginAnnotation = g.append('g')
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // g.append('line')
    //     .style("stroke", "lightgreen")
    //     .style("stroke-width", 1)
    //     .attr("x1", xScale(postpan[0].bin)+(2*xScale.bandwidth()))
    //     .attr("y1",200)
    //     .attr("x2", xScale(postpan[0].bin)+xScale.bandwidth()+60)
    //     .attr("y2", 150);

    // g.append('rect')
    //
    //
    //     var annotationBox = "rect"
    //     .attr('x',xScale(postpan[0].bin)+xScale.bandwidth()+60)
    //     .attr('y', 150+annotationBoxHeight/2)
    //     .style('stroke', 'black')
    //     .attr('fill', 'yellow')
    //     .attr('width',60)
    //     .attr('height',annotationBoxHeight )
    //
    //

    /////update functionality/////////
    d3.selectAll(".myRadio").on("change", update);
    update();

    function update(){
        var choices = [];
        d3.selectAll(".myRadio").each(function(d){
          radio=d3.select(this);
          if (radio.property("checked")){
            choices.push(radio.property("value"));
          }
        });
        console.log(choices);
        if (choices.length >0){
            if (choices.length == 2){
                 newData = data.filter(function(d){return d.direction == choices[0] &d.period == choices[1] })
                // newData2 = data.filter(function(d){return d.period == choices[1] })
                // newData= newData1.concat(newData2)

           }
            else{
                newData = data.filter(function(d){return d.direction == choices[0]|| d.period == choices[0]})
            }
            console.log(newData);
            // console.log(data)

            // newData = data.filter(function(d,i){return choices.includes(d);});


            // xScale =d3.scaleBand()
            //     .domain(newData.map(xValue))
            //     // .range([0,width/2]);
            //     .range([0,width]);

            yScale = d3.scaleLinear()
                .domain([0,d3.max(newData,yValue)])
                // .range([0,graphHeight]);
                .range([graphHeight,0]);



            g.selectAll("rect").remove();

            var boop = g.selectAll('rect')
                .data(newData)

            boop.enter().append('rect')
                .attr('width', xScale.bandwidth())
                .attr('fill','steelblue')
                .attr('opacity',.7)
                .attr('bin', d=>d.bin)
                .merge(boop)
                    // .attr('x', d => xScale(xValue(d)))
                    .attr('x', function(d){return xScale(xValue(d))+(xScale.bandwidth()+4)})
                // .attr('x', function(d){return xScale(xValue(d))+(1.5*xScale.bandwidth())})
                    .attr('y',function(d) { return yScale(yValue(d))})
                    .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
                    .attr("num", function (d){return d.avg})
                .on("mouseover", function(d){
                    console.log('hello')


                    var workingRect =  d3.select(this)

                    workingRect.
                    attr('fill','orange');



                    console.log(workingRect.attr('y')-workingRect.attr('height'))



                    div.transition()
                        .duration(200)
                        .style("opacity", .9)
                        .attr('fill','orange');
                    // div.innerHTML("Range:"+ here.getAttribute("min") + "-"+ here.getAttribute("max") + "<br/>"  + here.getAttribute("num"))
                    div.html(workingRect.attr("num")+" stations had an average of "+workingRect.attr("bin")+" Rides per hour")
                        // .style("left", (workingRect.attr('x'))+"px")
                        .style('left',500+"px")
                        .style("top",  (450)+"px")

                        // tooltip.html("Jello")
                        // .style("left", 30+ "px")
                        // .style("top", (0) + "px");

                console.log(d3.select(this).attr("bin"))

                // div.transition()
                //     .duration(200)
                //     .style("opacity", .9);
                // div.html(d3.select(this).min)
                //     .style("left", 500+ "px")
                //     .style("top", (500) + "px");
            })
                .on("mouseout", function(d) {
                    d3.select(this).
                    attr('fill','steelblue');

                  thisrect = d3.select(this)._groups[0][0];
                  console.log(thisrect)
                  console.log(thisrect.getAttribute("num"))
                    div.transition()
                        .duration(200)
                        .style("opacity", 0);
                    // div.html(thisrect.min)
                    //     .style("left", 500+ "px")
                    //     .style("top", (500) + "px");

                })
            .append('title').text(d=>d.avg);

            boop.exit().remove()


            //
            // //create new axes



            // g.append('g').call(d3.axisLeft(yScale))
            //     .attr("transform", "translate( "+ margin.left + "," + 0 + ")")
            //
            // g.append('g').call(d3.axisBottom(xScale).ticks(width/40).tickSizeOuter(0))
            //     .attr("transform", "translate( "+ margin.left + "," + graphHeight + ")");

            // var axisTest = g.selectAll("g.y.axis")
            //  console.log(axisTest)
            //

            yAxis.remove();
            // xAxis.remove();

            yAxis = g.append('g').call(d3.axisLeft(yScale))
                .attr("transform", "translate( "+ margin.left + "," + 0 + ")")

            // xAxis = g.append('g').call(d3.axisBottom(xScale).ticks(width/40).tickSizeOuter(0))
            //     .attr("transform", "translate( "+ margin.left + "," + graphHeight + ")");


            //  g.append('g').call(d3.axisLeft(yAxis))
            //      .attr("transform", "translate( "+ margin.left + "," + 0 + ")")
            //



    }}




    // var preButton = document.getElementById('pre');
    // console.log(preButton)
    //
    // preButton.onclick = function() {
    //     var filtered = data.filter(function (d) {return d.period == 'before';});
    //     console.log(filtered);
    //     update1(filtered);
    // }
    //
    // var duringButton = document.getElementById('during');
    // duringButton.onclick = function() {
    //     var filtered = data.filter(function (d) { return d.period == 'during';});
    //     console.log(filtered)
    //     update1(filtered);
    // }
    //
    // var afterButton = document.getElementById('post');
    // afterButton.onclick = function() {
    //     var filtered = data.filter(function (d) { return d.period == 'post';});
    //     console.log(filtered)
    //     update1(filtered);
    // }
    //
    //
    // var originButton = document.getElementById('origin');
    // originButton.onclick = function() {
    //     var filtered = data.filter(function (d) { return d.direction == 'origin';});
    //     console.log(filtered)
    //     update(filtered);
    // }
    //
    // var destinationButton = document.getElementById('destination');
    // destinationButton.onclick = function() {
    //     var filtered = data.filter(function (d) { return d.direction == 'destination';});
    //     console.log(filtered)
    //     update(filtered);
    // }

    g.append('text')
        .attr("class", "caption")
        .attr("font-family", "'Work sans', sans-serif")
        .attr("font-size", 30)
        .attr("x", w/2)
        .attr("y", h-2)
        .style('text-anchor', 'middle')
        .html('Histogram of BART Stations Binned by Average Rides Per Hour')


}



d3.csv("bartHistData.csv").then(data => {
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




