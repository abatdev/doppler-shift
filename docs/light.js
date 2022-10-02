function waveToRGB(wavelength_nm) {
    let gamma = 0.8;
    let maxIntensity = 255;
    let factor;
    let Red, Green, Blue;

    if((wavelength_nm >= 380) && (wavelength_nm < 440)) {
        Red = -(wavelength_nm - 440) / (440 - 380);
        Green = 0.0;
        Blue = 1.0;
    } else if((wavelength_nm >= 440) && (wavelength_nm < 490)) {
        Red = 0.0;
        Green = (wavelength_nm - 440) / (490 - 440);
        Blue = 1.0;
    } else if((wavelength_nm >= 490) && (wavelength_nm < 510)) {
        Red = 0.0;
        Green = 1.0;
        Blue = -(wavelength_nm - 510) / (510 - 490);
    } else if((wavelength_nm >= 510) && (wavelength_nm < 580)) {
        Red = (wavelength_nm - 510) / (580 - 510);
        Green = 1.0;
        Blue = 0.0;
    } else if((wavelength_nm >= 580) && (wavelength_nm < 645)) {
        Red = 1.0;
        Green = -(wavelength_nm - 645) / (645 - 580);
        Blue = 0.0;
    } else if((wavelength_nm >= 645) && (wavelength_nm < 781)) {
        Red = 1.0;
        Green = 0.0;
        Blue = 0.0;
    } else {
        Red = 0.0;
        Green = 0.0;
        Blue = 0.0;
    }

    // Let the intensity fall off near the vision limits

    if((wavelength_nm >= 380) && (wavelength_nm < 420)) {
        factor = 0.3 + 0.7 * (wavelength_nm - 380) / (420 - 380);
    } else if((wavelength_nm >= 420) && (wavelength_nm < 701)) {
        factor = 1.0;
    } else if((wavelength_nm >= 701) && (wavelength_nm < 781)) {
        factor = 0.3 + 0.7 * (780 - wavelength_nm) / (780 - 700);
    } else {
        factor = 0.0;
    }

    let rgb = [];

    // Don't want 0^x = 1 for x <> 0
    rgb.push(Red == 0.0 ? 0 : Math.round(maxIntensity * Math.pow(Red * factor, gamma)));
    rgb.push(Green == 0.0 ? 0 : Math.round(maxIntensity * Math.pow(Green * factor, gamma)));
    rgb.push(Blue == 0.0 ? 0 : Math.round(maxIntensity * Math.pow(Blue * factor, gamma)));

    return rgb;
}

let c = 299792458;
let wavefreq = 590;
let speedfactor = 0.1;

let xObserver = 0;

const colorbar = d3.select('#colorbar').append("svg")
    .attr('width', 400)
    .attr('height', 100);

const pix = 300.0

for (let i = 0; i < pix; ++i) {
    let freq = (((780-400)*i/pix) + 400) * Math.pow(10, 12);
    let nm = c * 1000000000 / freq;
    let color = waveToRGB(nm);
    colorbar.append('rect')
    .attr('x', i + 100)
    .attr('y', 10)
    .attr('width', 1)
    .attr('height', 800)
    .attr('fill', `rgb(${color[0]},${color[1]},${color[2]})`);
}
colorbar.append('circle')
    .attr('cx', 50)
    .attr('cy', 50)
    .attr('r', 40)
    .attr('id', 'colorbox')
    .style('fill', 'yellow')
    .style('stroke', 'black')
    .style('stroke-width', 3);

let dataRange = d3
  .range(0, 1001)
  .map(x => x)
  .map(x => ({ x, y: Math.sin(x*2*Math.PI*wavefreq/(0.25*600*600) + Date.now()*2*Math.PI*speedfactor*wavefreq/(0.3*600*600))}))

let height = 70;
let wid = 1000;
const xValue = d => d.x;
const yValue = d => d.y;

const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataRange.map(xValue)))
    .range([0, wid]);

const yScale = d3
    .scaleLinear()
    .domain([-1, 1])
    .range([0, height]);

const wave = d3.select('#wave').append("svg").attr('viewBox', `0 0 ${wid} ${height}`);

const line = d3
    .line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)));

    wave.append('path')
    .datum(dataRange)
    .attr('d', line)
    .attr('stroke', 'steelblue')
    .attr('fill', 'none');

    wave.append('image')
    .attr("xlink:href", "observer.png")
    .attr('x', `${xObserver+50}`)
    .attr('y', 0)
    .attr("width", 70)
    .attr("height", 70)

function drawSineWave() {
    dataRange = d3.range(0, 1001)
    .map(x => x)
    .map(x => ({ x, y: Math.sin(x*2*Math.PI*wavefreq/(0.25*600*600) + Date.now()*2*Math.PI*speedfactor*wavefreq/(0.3*600*600))}))   
    
    document.getElementById("wave").innerHTML = "";

    let wave = d3.select('#wave').append("svg").attr('viewBox', `0 0 ${wid} ${height}`);
    wave.append('path')
    .datum(dataRange)
    .attr('d', line)
    .attr('stroke', 'steelblue')
    .attr('fill', 'none');
    wave.append('image')
    .attr("xlink:href", "observer.png")
    .attr('x', `${xObserver+50}`)
    .attr('y', 0)
    .attr("width", 70)
    .attr("height", 70)
}

let slider = document.getElementById("velocitySlider");
let output = document.getElementById("val");

let resetBtn = document.getElementById("reset-btn");

resetBtn.onclick = function() {
    slider.value = 0;
}

function calculatePerceivedColor() {
    let percFrequency = (1 + (slider.value*3/1000))*wavefreq * Math.pow(10, 12);
    let percWavelength_nm = c * 1000000000 / percFrequency;
    return waveToRGB(percWavelength_nm);
}

function calculateTrueWavesPerSecond() {
    let wavelen = 0.25*600*600/wavefreq;
    let relspeed = (1 + (slider.value*3/1000))*0.3*600*600/(2.3*wavefreq);
    return relspeed / wavelen;
}

// Call this function every 4 milliseconds to create animation.
function updateLight() {
    xObserver += (slider.value*speedfactor/100);
    xObserver = (xObserver + 500) % 500;
    drawSineWave();
    let col = calculatePerceivedColor();
    document.getElementById('colorbox').style.fill= `rgb(${col[0]},${col[1]},${col[2]})`;
    document.getElementById('wps').innerHTML = calculateTrueWavesPerSecond().toFixed(2);
}

setInterval(updateLight, 4);

function wpsToggle() {
    document.getElementById("wpsTut").classList.toggle("show");
}
function sunToggle() {
    document.getElementById("sunTut").classList.toggle("show");
}