
var w = 1000;
var h = 1000;

const margin = {top: 30, right: 20, bottom: 20, left: 20};
const width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;
const graphHeight = 900;
const graphWidth = 3000

const g = d3.select("body").append("svg")
    .attr("width", graphWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 100 + ")");



var render = data =>{


   var format =  d3.format(",.2f");

//set default slider settings
    var workingYear = 2011;
    var workingMonth = 1;
    var workingHour = 9;


    //from _____
    var projection = d3.geoMercator()
        .scale(80000)
        .center([-122.2927387, 37.631258])
        .translate([width / 2, height / 2]);


    var path = d3.geoPath()
        .projection(projection);

    var map = g.append("g");

// load and display the World
    d3.json("Bay_Area.json").then(function(topology) {

        map.selectAll("path")
            .data(topology.features)
            .enter().append("path")
            .attr("d", path)
            .style('fill', 'gainsboro');

    });



    function update(val,period){
       if (period == 'year') {
           // console.log(data)
           // let year = d3.timeFormat('%Y')(val);
           let year = val;
           workingYear = year;
           console.log(year);
           var newData = data.filter(d=>d.year == +year & +d.hour == workingHour & +d.month == workingMonth)
           // console.log(newData)
       }

       if (period == 'hour'){
           // console.log(val)
           let hour = val;
           workingHour = hour;
           var newData = data.filter(d=> +d.hour == hour & +d.month == workingMonth & +d.year == workingYear)
           // console.log(newData)
       }
        if (period == 'month'){
            // console.log(val)
            let month = val;
            workingMonth = month;
            var newData = data.filter(d=> +d.hour == workingHour & +d.month == workingMonth & +d.year == workingYear)
            console.log(newData)
        }

       g.selectAll("circle").remove();

        var boop = g.selectAll('circle')
            .data(newData)
            .join('circle')
            .attr('fill','blue')
            .attr('opacity',.2)
            .attr('r',d=>d.x)
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .append("title")
            .text(function (d){return "Station: "+d["full name"]+ "\nAvg Rides Per Hour: " + format(d.x)} )
            // .text("hello");
        //Simple tooltip
        //     .text(function(d) {
        //         // console.log(d["full name"])
        //         return d["full name"] + d.x;
        //     });
        //
        // boop.exit().remove()

    }


    //plot original circles
    var initialData = data.filter(d=> +d.hour == workingHour & +d.month == workingMonth & +d.year == workingYear)

    g.selectAll("circle")
        .data(initialData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", d=>d.x)
        .style("fill", "blue")
        .style("stroke", "gray")
        .style("stroke-width", 0.25)
        .style("opacity", 0.2)
        .append("title")			//Simple tooltip
        .text(function(d) {
            return "Station: "+d["full name"]+ "\nAvg Rides Per Hour: " +format(d.x);
        });

  ///// Year Slider from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518/////
    var dataTime = d3.range(0, 11).map(function(d) {
        return new Date(2011 + d, 10, 3);
    });

    var sliderYear = d3
        .sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(300)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(2011, 10, 3))
        .on('onchange', val => {
            let year = d3.timeFormat('%Y')(val);
            d3.select('p#year-value').text(d3.timeFormat('%Y')(val));
            update(year,'year')
            // console.log(year)
        });

    var gTime = d3
        .select('#year-slider')
        .append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gTime.call(sliderYear);

    d3.select('p#year-value').text(d3.timeFormat('%Y')(sliderYear.value()));

   ///Slider Month////
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    var sliderMonth = d3
        .sliderBottom()
        .min(1)
        .max(12)
        .step(1)
        .width(300)
        // .tickFormat(d3.timeFormat('%b'))
        // .tickValues(months)
        .default(1)
        .on('onchange', val => {
            // let year = d3.timeFormat('%Y')(val);
            d3.select('p#month-value').text(val);
            update(val,'month')
            // console.log(year)
        });

    var gMonth = d3
        .select('#month-slider')
        .append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gMonth.call(sliderMonth);

    // d3.select('p#month-value').text(sliderMonth.value());


    /////Hour slider/////
    var hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    var sliderHour = d3
        .sliderBottom()
        .min(0)
        .max(23)
        .step(1)
        .width(300)
        // .tickFormat()
        .tickValues(hours)
        .default(9)
        .on('onchange', val => {
            d3.select('p#hour-value').text(val);
            console.log(val)
            update(val,'hour')
        });

    var gHour = d3
        .select('#hour-slider')
        .append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gHour.call(sliderHour);
    d3.select('p#hour-value').text(sliderHour.value());
}


d3.csv("bartfull.csv").then(data => {

    render (data);
});
