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

   for (i in dimensions){
       name = dimensions[i];
       y[name] = d3.scaleLinear()
           .domain(d3.extent(data, function(d){return +d[name];}))
           .range([graphHeight,0])
   }

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

/////Attempt at Annotations////

   // console.log("here")
   //  var fruit = data.filter(function(d){return d.station == "FTVL"})
   //
   //  console.log(fruit[1]["Before"])
   //  console.log(y["After"](fruit[1]["After"]));

    // const annotations = [
    //     {
    //         note: {
    //             label: "Basic settings with subject position(x,y) and a note offset(dx, dy)",
    //             title: "d3.annotationLabel"
    //         }, subject: {
    //                          radius: 100
    //                      },
    //         x: x("After") ,
    //         y: y["After"](fruit[1]["After"]),
    //         dy: -180,
    //         dx: 100
    //     },{
    //         //          note: {
    //         //              label: "Added connector end 'arrow', note wrap '180', and note align 'left'",
    //         //              title: "d3.annotationLabel",
    //         //              wrap: 150,
    //         //              align: "left"
    //         //          },
    //         //          connector: {
    //         //              end: "arrow" // 'dot' also available
    //         //          },
    //         //          x: 170,
    //         //          y: 150,
    //         //          dy: 137,
    //         //          dx: 162
    //         //      },{
    //         //          note: {
    //         //              label: "Changed connector type to 'curve'",
    //         //              title: "d3.annotationLabel",
    //         //              wrap: 150
    //         //          },
    //         //          connector: {
    //         //              end: "dot",
    //         //              type: "curve",
    //         //              //can also add a curve type, e.g. curve: d3.curveStep
    //         //              points: [[100, 14],[190, 52]]
    //         //          },
    //         //          x: 350,
    //         //          y: 150,
    //         //          dy: 137,
    //         //          dx: 262
    //         //      },{
    //         //          //below in makeAnnotations has type set to d3.annotationLabel
    //         //          //you can add this type value below to override that default
    //         //          type: d3.annotationCalloutCircle,
    //         //          note: {
    //         //              label: "A different annotation type",
    //         //              title: "d3.annotationCalloutCircle",
    //         //              wrap: 190
    //         //          },
    //         //          //settings for the subject, in this case the circle radius
    //         //          subject: {
    //         //              radius: 50
    //         //          },
    //         //          x: 620,
    //         //          y: 150,
    //         //          dy: 137,
    //         //          dx: 102
    //     }].map(function(d){ d.color = "#E8336D"; return d})
    // //
    // const makeAnnotations = d3.annotation()
    //     .type(d3.annotationCalloutCircle)
    //     .annotations(annotations);
    //
    // g
    //     .append("g")
    //     .attr("class", "annotation-group")
    //     .call(makeAnnotations)
    //


   //make color scale
    var color =  d3.scaleOrdinal()
        .domain(["East Bay", "Peninsula", "San Francisco","South Bay"])
        .range(["#1b9e77","#d95f02","#7570b3", "#e7298a"]);


   //create path scale
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

// var div = g.append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 1)
//     .attr('fill','blue')
//     .attr("transform", "translate(" + 100 + "," + 100 + ")");

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
        .attr('visibility', 'visible')
        // .style("opacity", 0.5)
        .on("mouseover", function() {

            currLine = d3.select(this);


            // console.log(currLine._groups[0][0]).getAttribute('during');

            currLine
                // .style("stroke", "yellow")
                .style("stroke-width",6)
                .style("opacity", 0.5);

            // div.transition()
            //     .duration(200)
            //     .style("opacity", 1)
            //     .attr('background','green');

            div.html(currLine.attr('station')+",\n"+currLine.direction)


        })
        .on("mouseout", function() {
            d3.select(this).style("stroke", "#69b3a2")
                .style("stroke-width",1)
                .style("opacity",1)
                .style("stroke",function(d){return color(d.region)});
        })
        .append('title')
        .text(function(d){return "Station: "+d.station +"\nDirection: "+ d.direction})
        // .text(function (d){return d.station + ","+ (d.direction)});  //not working, after clicking origin the origin lines direction says dest


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


///create a brush for the axes///


    ///////button functionality //////

    //destination radio filter
    var destinationButton = document.getElementById('destination');

    // var myElem = document.getElementByID('destination');

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

       // u
       //     .enter()
       //     .append("path")
       //     .merge(u)
       //     .transition()
       //     .duration(1000)
           .attr("d",  path)
           .attr("id", d=>d.station)
           .attr("direction",d=>d.direction)
           .style("stroke", function(d){return color(d.region)})
           // .style("stroke", 'purple')
           .style("fill", 'none')
           .select('title')
           .text(function (d){return d.station +"," +d.direction});



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


           display == "visible"? hello.attr('visibility', 'visible'):hello.attr('visibility', 'hidden')



    });



}




    function updateCheck(){
        // For each check box:
        d3.selectAll(".checkbox").each(function(d){
            cb = d3.select(d);
            console.log(cb);
            let grp = cb.property("value")
            // If the box is check, I show the group
            if(cb.property("checked")){
                console.log(grp);
                var someLines = d3.selectAll('path');
                var workingLines = [];
                someLines.forEach(function(d){
                    if(d.region == grp){
                        workingLines.push(d.region)
                    }
                });

                console.log(workingLines)
                // {return e.region == cb.property("label")})
                //  workingLines
                //         .style("opacity",1);
                }
   // Otherwise I hide it
            else{
                // g.selectAll("."+grp).transition().duration(1000).style("opacity", 0)
                var someLines = d3.selectAll('path');
                var workingLines = [];
                someLines.forEach(function(d){
                    if(d.region == grp){
                        workingLines.push(d.region)
                    }
                });

                console.log(workingLines)
                // var workingLines = d3.selectAll('path').filter(function (e){return e.region == cb.property("label")})
                // workingLines
                //     .style("opacity",0);

                // d3.selectAll('path')
                //     .filter(function (d){return d.region == cb.property("label")})
                //     .style("opacity",0)
            }
        })

    }

    // When a button change, I run the update function
    // d3.selectAll(".checkbox").on("change",updateCheck);

d3.selectAll(".checkbox").on("change",console.log("hello"));




d3.csv("bartData.csv").then(data => {

    data.forEach(d => {
        d.station = d["Station"];
        d.direction = d['Direction'];
        d.b4 = +d["Before"];
        d.during = +d["During"];
        d.after = +d["After"];
        d.region = d["Region"];

    });

    render (data);
});