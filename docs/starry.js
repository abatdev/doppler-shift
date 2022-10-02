var w = window.innerWidth;
var h = window.innerHeight;

var svg = d3.select("#bgDiv")
.append("svg")
.attr("width", w)
.attr("height", h);

var correctZoom = d3.scaleLinear()
            .domain([0, window.devicePixelRatio])
            .range([0, 1]);

var aFactor = Math.round(w*h/500000);

drawStars();

function drawStars () {
	var smallStars = [];
	for (var i = 0; i < aFactor*100; i++) {
	  smallStars.push({"x": randomX(), "y": randomY()});  
	}

	var mediumStars = [];
	for (var i = 0; i < aFactor*10; i++) {
	  mediumStars.push({"x": randomX(), "y": randomY()});  
	}

	var bigStars = [];
	for (var i = 0; i < aFactor; i++) {
	  bigStars.push({"x": randomX(), "y": randomY()});  
	}

	d3.selectAll("svg > *").remove();

	svg.selectAll(".smallStar")
	.data(smallStars)
	.enter()
	.append("circle")
	.classed("smallStar", true)
	.attr("cx", function(d) {return d.x})
	.attr("cy", function(d) {return d.y})
	.attr("r", "1px")
	.style("fill", "#fff");

	svg.selectAll(".mediumStar")
	.data(mediumStars)
	.enter()
	.append("circle")
	.classed("mediumStar", true)
	.attr("cx", function(d) {return d.x})
	.attr("cy", function(d) {return d.y})
	.attr("r", "2px")
	.style("fill", "#fff");

	svg.selectAll(".bigStar")
	.data(bigStars)
	.enter()
	.append("circle")
	.classed("bigStar", true)
	.attr("cx", function(d) {return d.x})
	.attr("cy", function(d) {return d.y})
	.attr("r", "3px")
	.style("fill", "#fff");

}


function randomX() {
  return Math.round(Math.random()*window.innerWidth)
}

function randomY() {
  return Math.round(Math.random()*window.innerHeight)
}