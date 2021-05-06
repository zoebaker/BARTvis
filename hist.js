

var w = 1700;
var h = 600;

const margin = {top: 30, right: 20, bottom: 20, left: 20};
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
    .style("opacity", 1)
    .attr("transform", "translate(" + 300+ "," + 200 + ")");

// var div = g.append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 1)
//     .attr('fill','blue')
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var render = data => {
    const xValue = d=>d.bin;
    const yValue = d=>d.avg;

    const xScale =d3.scaleBand()
        .domain(data.map(xValue))
        .range([0,width/2]);

    const yScale = d3.scaleLinear()
        .domain([0,d3.max(data,yValue)])
        // .range([0,graphHeight]);
        .range([graphHeight,0]);


    //print axes
    const yAxis = d3.axisLeft(yScale)
    const xAxis = d3.axisBottom(xScale)

    g.append('g').call(d3.axisLeft(yScale))
        .attr("transform", "translate( "+ margin.left + "," + 0 + ")")

    g.append('g').call(d3.axisBottom(xScale).ticks(width/40).tickSizeOuter(0))
        .attr("transform", "translate( "+ margin.left + "," + graphHeight + ")");
        // .attr("text-anchor", "end")

    const rects = g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect');

    rects
        .attr('width', xScale.bandwidth())
        .attr('fill','steelblue')
        .attr('opacity',.7);
        // .attr('x', d => xScale(xValue(d)))
    rects
        .attr('x', function(d,i){return xScale(xValue(d))+xScale.bandwidth()})
        .attr('y',function(d) { return yScale(yValue(d))})
        .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
        // .append('title').text(d=>d.avg)
        .attr('min', function(d){return d.x0})
        .attr('max',d=>d.x1)
        .attr('opacity',.7)
        .on("mouseover", function(d) {
            var here = d3.select(this)

            here.
            attr('fill','orange');

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

            // div.transition()
            //     .duration(200)
            //     .style("opacity", 0)
            //     .attr('fill','orange');
            // div.html()
            //     .style("left", 300+ "px")
            //     .style("top", (200) + "px");

        });



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

            var boop = g.selectAll('rect')
                .data(newData)

            boop.enter().append('rect')
                .attr('width', xScale.bandwidth())
                .attr('fill','steelblue')
                .attr('opacity',.7)
                .merge(boop)
                    .attr('x', d => xScale(xValue(d)))
                    .attr('x', function(d){return xScale(xValue(d))+xScale.bandwidth()})
                    .attr('y',function(d) { return yScale(yValue(d))})
                    .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
                    .attr("num", function (d){return d.avg})
                    // .append('title').text(this.attr("num"))
        .on("mouseover", function(d) {
                d3.select(this).
                attr('fill','orange');

                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d3.select(this).min)
                    .style("left", 500+ "px")
                    .style("top", (500) + "px");
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
                    div.html(thisrect.min)
                        .style("left", 500+ "px")
                        .style("top", (500) + "px");

                });

            boop.exit().remove()

    }}



    /////og update function///////

    function update1(filteredData){
        var u = g.selectAll('rect')
            .data(filteredData)

        //if there is data that does not have a rect
        u.enter().append('rect')
            .merge(u)
            // // .join("rect")
            .attr('width', xScale.bandwidth())
            .attr('x', d => xScale(xValue(d)))
            .attr('x', function(d){return xScale(xValue(d))+xScale.bandwidth()})
            .attr('y',function(d) { return yScale(yValue(d))})
            .attr('height',function(d) {return yScale(0) - yScale(yValue(d))})
            .attr('fill','green')
            .append('title').text(d=>d.avg)

        //if there are elements that don't have data, remove them
        u.exit().remove();
    }

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




