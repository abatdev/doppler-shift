function build(){
    for (let i = 0; i < rings; i++) { 
        var position = parseInt(d3.select("svg").style("width"))/3 + i*20;
        
        d3.select("svg")
        .append("circle")
        .attr("id","circle"+i)
        .attr('cx', position)
        .attr('cy', "50%")
        .attr('r', 0)
        .attr('stroke', '#398FBD')
        .attr("stroke-width", strokeWidth)
        .attr('fill', 'none')
        .each(animate)
    }

}


function animate(){
    for (let i = 0; i < rings; i++) { 
        
        d3.select("#circle"+i)
        .transition()
        .duration(7000)
        .attr("r", "400")
        .attr("stroke-width", 0)
        .ease(d3.easeLinear)
        .delay(i*sliderVal)
        .transition()
        .duration(0)
        .attr("r", "0")
        .attr("stroke-width", strokeWidth)
        .ease(d3.easeLinear)
        .transition()
        .delay((rings -i -1)*sliderVal)
        .on("end",animate)

    }

}


function findSpeed(){
    const speed = soundSlider.value;
    if (speed <= 10){
        return "🚶" 
    }
    else if(speed <= 100){
        return "🚘"
    }
    else if(speed <= 250){
        return "✈️"
    }
    else if(speed <= 343){
        return "🛩 (non-commercial aircrafts)"
    }
    else if(speed <= 400){
        return "🚀 (supersonic)"
    }
    else{
        return ""
    }
}

// Try changeing the values below
var rings = 9;
var strokeWidth = 7;

// __main__ code
var soundSlider = document.getElementById("soundSlider");
var sliderVal = 1200 - soundSlider.value*2.5; //250 - 350-1200. 350 = 343. 1200-slider*2.5
document.getElementById("mps").innerHTML = "" + soundSlider.value + " meters per second " + findSpeed();

d3.select("#soundContainer")
.append("svg")
.attr("width","100%")
.attr("height","400px")

d3.select("svg").append("rect")
.attr("width", "100%")
.attr("height", "100%")
.attr("fill", "#080820");


soundSlider.addEventListener("change", function() { 
    sliderVal = 1200 - soundSlider.value*2.5;  
    document.getElementById("mps").innerHTML = "" + soundSlider.value + " meters per second " + findSpeed();
    
    for (let i = 0; i < rings; i++) { 
        d3.select("#circle"+i).interrupt();
        d3.select("#circle"+i).remove();
    }
    build()

})


build()