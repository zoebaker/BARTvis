//Reference: https://www.d3-graph-gallery.com/graph/parallel_basic.html

var w = 800;
var h = 800;

const margin = {top: 30, right: 20, bottom: 20, left: 20};
const width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

const graphHeight = 750;

const g = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var render = data => {

   // set the y axes
    var dimensions = ["Before", "During", "After"];

   var y = {};


    y["Before"] = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){return +d["Before"]})])
        .range([graphHeight,0]);

    y["During"] = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){return +d["During"]})])
        .range([graphHeight,0]);

    y["After"] = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){return +d["During"]})])
        .range([graphHeight,0]);

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width+100])
        .padding(1)
        .domain(dimensions);

///Zoom///

    g.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

    function zoomed({transform}) {
        g.attr("transform", transform);
    }

//make color scale
    var color =  d3.scaleOrdinal()
        .domain(["East Bay", "Peninsula", "San Francisco","South Bay"])
        .range(["#1b9e77","#d95f02","#7570b3", "#e7298a"]);


   //create path scale
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }


var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1)

    // Draw the station lines
    g
        .selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", function(d){return color(d.region)})
        .style("stroke-width",1)
        .attr("id", d=>d.station)
        .attr("direction", d=>d.direction)
        .attr('region', d=>d.region)
        .attr('before',d=>d.b4)
        .attr('during',d=>d.during)
        .attr('after',d=>d.after)
        .attr('fullName', d=>d.fullName)
        .attr('visibility', 'visible')
        .on("mouseover", function() {
            currLine = d3.select(this);
            currLine
                .style("stroke-width",6)
                .style("opacity", 0.5);
        })
        .on("mouseout", function() {
            d3.select(this).style("stroke", "#69b3a2")
                .style("stroke-width",1)
                .style("opacity",1)
                .style("stroke",function(d){return color(d.region)});
        })
        .append('title')
        .text(function(d){return "Station: "+d.fullName +"\nDirection: "+ d.direction+"\nBefore: "+d.b4+"\nDuring: "+d.during+"\nAfter: "+d.after})

//draw legend
    //create legend group
    g.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(-10,0)");

    //create legend
    var legendOrdinal = d3.legendColor()
        .shapeWidth(30)
        // .labelFormat(d3.format(".0f"))
        .scale(color);
    //append legend
    g.select(".legendOrdinal")
        .call(legendOrdinal);

    // Draw the y axes:
    var axes = g.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) {d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")

    ///////button functionality //////

    //destination radio filter
    var destinationButton = document.getElementById('destination');

    destinationButton.onclick = function() {
        var filtered = data.filter(function (d) { return d.direction == 'destination';});
        console.log(filtered);
        update(filtered);
    }

    //origin radio filter
    var originButton = document.getElementById('origin');
     originButton.onclick = function() {
        var filtered = data.filter(function (d) { return d.direction == 'origin';});
        console.log(filtered)
        update(filtered);
    }


   function update(filteredData){

       g.selectAll(".myPath").remove();

       var u = g.selectAll("path")
           .data(filteredData)
           .join("path")


           .attr("d",  path)
           .attr("id", d=>d.station)
           .attr("direction",d=>d.direction)
           .style("stroke", function(d){return color(d.region)})
           // .style("stroke", 'purple')
           .style("fill", 'none')
           .select('title')
           .text(function(d){return "Station: "+d.fullName +"\nDirection: "+
               d.direction+"\nBefore: "+d.b4+"\nDuring: "+d.during+"\nAfter: "+d.after});



       g.selectAll("myAxis")
           // For each dimension of the dataset I add a 'g' element:
           .data(dimensions).enter()
           .append("g")
           // I translate this element to its right position on the x axis
           .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
           // And I build the axis with the call function
           .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
           // Add axis title
           .append("text")
           .style("text-anchor", "middle")
           .attr("y", -9)
           .text(function(d) { return d; })
           .style("fill", "black")
    }


//////check box filtering///////
    d3.selectAll(".myCheckbox").on("change", function() {
        var type = this.value,
            // I *think* "inline" is the default.
            display = this.checked ? "visible" : "hidden";

        console.log(type);
        console.log(display)

        
        var hello = g.selectAll("path")
            .filter(function() {
                return d3.select(this).attr("region") == type; // filter by single attribute
            })

console.log(hello);
        
           display == "visible"? hello.attr('visibility', 'visible'):hello.attr('visibility', 'hidden')

    });


}


d3.csv("bartData.csv").then(data => {

    data.forEach(d => {
        d.station = d["Station"];
        d.direction = d['Direction'];
        d.b4 = +d["Before"];
        d.during = +d["During"];
        d.after = +d["After"];
        d.region = d["Region"];
        d.fullName = d["fullName"];

    });

    render (data);
});
