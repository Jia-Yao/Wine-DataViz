// =========================== Set up scrolling ===========================
var text = d3.selectAll('.text');
var active = varieties;

function init() {
  Stickyfill.add(d3.selectAll('.graphic').node());

  enterView({
    selector: text.nodes(),
    offset: 0.5,
    enter: function enter(el) {
      var index = +d3.select(el).attr('data-index');
      update(index);
    },
    exit: function exit(el) {
      var index = +d3.select(el).attr('data-index');
      index = Math.max(0, index - 1);
      update(index);
    } });
}

function update(index) {
  text.classed('is-active', function (d, i) {return i === index;});
  switch (index){
    case 0:
      active = varieties;
      updateBarChart(80);
      break;
    case 1:
      active = ['Chardonnay', 'Pinot Gris', 'Riesling'];
      updateBarChart(80);
      break;
    case 2:
      active = ['Chardonnay', 'Pinot Gris', 'Riesling'];
      updateBarChart(96);
      break;
    case 3:
      active = ['Rosé'];
      updateBarChart(80);
      break;
    case 4:
      active = ['Rosé'];
      updateBarChart(96);
      break;
    case 5:
      active = ['Bordeaux-style Red Blend', 'Chardonnay', 'Pinot Noir'];
      updateBarChart(98);
      break;
    case 6:
      $("#radioBordeaux").prop( "checked", true );
      updateLineChart('Bordeaux-style Red Blend');
      break;
    case 7:
      $("#radioChardonnay").prop( "checked", true );
      updateLineChart('Chardonnay');
      break;
    case 8:
      $("#radioPinot").prop( "checked", true );
      updateLineChart('Pinot Noir');
      break;
    case 9:
    case 10:
    case 11:
      break;
    default:
      break;
  }
}
// =========================== End of scrolling ===========================


// =========================== Part 1: Bar Chart ==========================
// Reference: https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad
// Reference: https://bl.ocks.org/ericsoco/647db6ebadd4f4756cae
var color = {'France': '#92c5de', 'US': '#ec0040'};
var countries = ['France', 'US'];
var varieties = ['Bordeaux-style Red Blend', 'Chardonnay', 'Pinot Gris', 'Pinot Noir', 'Riesling', 'Rosé'];
var margin1 = {top: 20, right: 20, bottom: 50, left: 70};
var w1full = $('#graphic1').width();
var h1full = $('#graphic1').height() - $('#slidercontainer').outerHeight(true);
var w1 = w1full - margin1.left - margin1.right;
var h1 = h1full - margin1.top - margin1.bottom;
var x0 = d3.scaleBand().domain(varieties).rangeRound([0, w1]).padding(0.2);
var x1 = d3.scaleBand().domain(countries).rangeRound([0, x0.bandwidth()]).padding(0.05);
var y = d3.scaleLog().domain([1e-1, 1e5]).range([h1, 0]).base(10);
var datasetBarChart, i, j, svg1, legend1, bars;

// Set up svg, axes, bars, and legend
svg1 = d3.select('#graphic1').append('svg').attr('width', w1full).attr('height', h1full)
  .append('g').attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')');
svg1.append('g')
  .attr('class', 'x axis').attr('transform', 'translate(0,' + h1 + ')').call(d3.axisBottom(x0).tickSize(0))
  .style("text-anchor", "end").selectAll("text").call(wrap, x0.bandwidth());
svg1.append('g')
  .attr('class', 'y axis').call(d3.axisLeft(y).tickValues([1e-1,1e0,1e1,1e2,1e3,1e4,1e5]).tickFormat(d3.format(".0f")));
svg1.append('text')
  .attr('transform', 'rotate(-90)').attr('y', 0 - margin1.left + 10).attr('x', 0 - (h1 / 2)).attr('dy', '1em')
  .style('text-anchor', 'middle').text('Number of Wine Reviews');
svg1.append('text')
  .attr('transform', 'rotate(0)').attr('y', h1 + 15).attr('x', w1 / 2).attr('dy', '1em')
  .style('text-anchor', 'middle').text('Wine Variety');
bars = svg1.append('g');
for (i=0; i<countries.length; i++) {
  for (j=0; j<varieties.length; j++) {
    var str = varieties[j].replace(/\s/g, '');
    bars.append('rect').attr('id', countries[i]+str).attr('class', str)
      .attr('transform', 'translate(' + x0(varieties[j]) + ',0)')
      .attr('x', x1(countries[i]))
      .attr('y', h1)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', color[countries[i]]);
  }
}
legend1 = svg1.selectAll('.legend').data(countries).enter().append('g')
  .attr('class', 'legend').attr('transform', function(d,i) { return 'translate(0,' + i * 20 + ')'; });
legend1.append('rect')
  .attr('x', w1 - 18).attr('width', 18).attr('height', 18).style('fill', function(d) { return color[d]; });
legend1.append('text')
  .attr('x', w1 - 24).attr('y', 9).attr('dy', '.35em')
  .style('text-anchor', 'end').text(function(d) { return d; });

// Load data
d3.csv('data/Count.csv').then(function(data) {
  datasetBarChart = Array(21).fill().map((_, i) => []);
  for (i=0; i<data.length; i++) {
    for (j=0; j<varieties.length; j++) {
      datasetBarChart[data[i]['Min Points'] - 80].push({
        'variety': varieties[j],
        'country': data[i]['Country'],
        'count': data[i][varieties[j]]
      });
    }
  }
});


// Helper
function wrap (text, width) {
  text.each(function() {
    var breakChars = ['/', '&', '-'], text = d3.select(this), textContent = text.text(), spanContent;

    breakChars.forEach(char => {
      textContent = textContent.replace(char, char + ' ');
    });

    var words = textContent.split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.2,
      x = text.attr('x'),
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy') || 0),
      tspan = text.text(null).append('tspan').attr('x', width/2).attr('y', y).attr('dy', dy + 'em');

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        spanContent = line.join(' ');
        breakChars.forEach(char => {
          spanContent = spanContent.replace(char + ' ', char);
        });
        tspan.text(spanContent);
        line = [word];
        tspan = text.append('tspan').attr('x', width/2).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
      }
    }
  });
}

// Update
function updateBarChart(rating) {
  if (datasetBarChart){
    $('#slider').val(rating);
    $('#sliderVal').text(rating);
    datasetBarChart[rating - 80].forEach(function(element) {
      if (element.count == 0){
        svg1.select('#'+element.country+element.variety.replace(/\s/g, ''))
        .attr('y', element.count == 0 ? 0.1 : y(element.count))
        .attr('height', element.count == 0 ? 0.1 : h1 - y(element.count))
        .style("opacity", active.includes(element.variety) ? 1 : 0.25);
      } else {
        svg1.select('#'+element.country+element.variety.replace(/\s/g, ''))
        .transition().duration(500)
        .attr('y', element.count == 0 ? 0.1 : y(element.count))
        .attr('height', element.count == 0 ? 0.1 : h1 - y(element.count))
        .style("opacity", active.includes(element.variety) ? 1 : 0.25);
      }
    });
  } else {
    setTimeout(function (){
      $('#slider').val(rating);
      $('#sliderVal').text(rating);
      datasetBarChart[rating - 80].forEach(function(element) {
        if (element.count == 0){
          svg1.select('#'+element.country+element.variety.replace(/\s/g, ''))
          .attr('y', element.count == 0 ? 0.1 : y(element.count))
          .attr('height', element.count == 0 ? 0.1 : h1 - y(element.count))
          .style("opacity", active.includes(element.variety) ? 1 : 0.25);
        } else {
          svg1.select('#'+element.country+element.variety.replace(/\s/g, ''))
          .transition().duration(500)
          .attr('y', element.count == 0 ? 0.1 : y(element.count))
          .attr('height', element.count == 0 ? 0.1 : h1 - y(element.count))
          .style("opacity", active.includes(element.variety) ? 1 : 0.25);
        }
      });
    }, 500);
  }
}

$('#slider').on('input change', function() {
  updateBarChart($(this).val());
});
// =========================== End of Bar Chart ===========================


// =========================== Part 2: Line Chart =========================
// Reference: https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
var margin2 = {top: 20, right: 20, bottom: 50, left: 60};
var w2full = $('#graphic2').width();
var h2full = $('#graphic2').height() - $('#radiocontainer').outerHeight(true);
var w2 = w2full - margin2.left - margin2.right;
var h2 = h2full - margin2.top - margin2.bottom;
var xScaleLine = d3.scaleLinear().domain([80, 100]).range([0, w2]);
var yScaleLine = d3.scaleLinear().domain([0, 900]).range([h2, 0]);
var line_FR = d3.line().x(function(d) { return xScaleLine(d.points); }).y(function(d) { return yScaleLine(d.price); })
var line_US = d3.line().x(function(d) { return xScaleLine(d.points); }).y(function(d) { return yScaleLine(d.price); })
var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0).style("display", "none");
var datasetLineChart, svg2, legend2;

// Set up svg, axes, and legend
svg2 = d3.select('#graphic2').append("svg").attr("width", w2full).attr("height", h2full)
  .append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
svg2.append("g")
  .attr("class", "x axis").attr("transform", "translate(0," + h2 + ")").call(d3.axisBottom(xScaleLine).ticks(20));
svg2.append("g")
  .attr("class", "y_axis").call(d3.axisLeft(yScaleLine));
svg2.append("text")
  .attr("transform", "rotate(-90)").attr("y", 0 - margin2.left + 10).attr("x", 0 - (h2 / 2)).attr("dy", "1em")
  .style("text-anchor", "middle").text("Average Price $");
svg2.append("text")
  .attr("transform", "rotate(0)").attr("y", h2 + 20).attr("x", w2/2).attr("dy", "1em")
  .style("text-anchor", "middle").text("Review Rating");
legend2 = svg2.selectAll('.legend').data(countries).enter().append('g')
  .attr('class', 'legend').attr('transform', function(d,i) { return 'translate(0,' + i * 20 + ')'; });
legend2.append('rect')
  .attr('x', margin2.left + 18).attr('width', 18).attr('height', 18).style('fill', function(d) { return color[d]; });
legend2.append('text')
  .attr('x', margin2.left + 12).attr('y', 9).attr('dy', '.35em')
  .style('text-anchor', 'end').text(function(d) { return d; });

// Helper
function drawFrance() {
  var data = datasetLineChart.filter(function(d) {
    return d.country == "France";
  })
  svg2.select("#line_FR").remove();
  svg2.append("path").datum(data)
    .attr("id", "line_FR").attr("d", line_FR);
  svg2.selectAll(".dot_FR").remove();
  svg2.selectAll(".dot_FR").data(data).enter().append("circle")
    .attr("class", "dot_FR")
    .attr("cx", function(d) { return xScaleLine(d.points) })
    .attr("cy", function(d) { return yScaleLine(d.price) })
    .attr("r", 2)
    .on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", .9);    
      tooltip.html("Country: " + d.country + "<br/>"
        + "Average Price: $" + parseFloat(d.price).toFixed(2) + "<br/>" 
        + "Rating: " + d.points + "<br/>"
        + "Number of records: " + d.records)  
          .style("left", (d3.event.pageX - 164) + "px")   
          .style("top", (d3.event.pageY - 28) + "px")
          .style("background-color", "white")
          .style("display", "block");
    })          
    .on("mouseout", function(d) {   
      tooltip.transition().duration(500).style("opacity", 0).style("display", "none");
    });
}

function drawUS() {
  var data = datasetLineChart.filter(function(d) {
    return d.country == "US";
  })
  svg2.select("#line_US").remove();
  svg2.append("path").datum(data)
    .attr("id", "line_US").attr("d", line_US);
  svg2.selectAll(".dot_US").remove();
  svg2.selectAll(".dot_US").data(data).enter().append("circle")
    .attr("class", "dot_US")
    .attr("cx", function(d) { return xScaleLine(d.points) })
    .attr("cy", function(d) { return yScaleLine(d.price) })
    .attr("r", 2)
    .on("mouseover", function(d) {   
      tooltip.transition().duration(200).style("opacity", .9);    
      tooltip.html("Country: " + d.country + "<br/>"
        + "Average Price: $" + parseFloat(d.price).toFixed(2) + "<br/>" 
        + "Rating: " + d.points + "<br/>"
        + "Number of records: " + d.records)  
          .style("left", (d3.event.pageX - 164) + "px")   
          .style("top", (d3.event.pageY - 28) + "px")
          .style("background-color", "white")
          .style("display", "block");
    })          
    .on("mouseout", function(d) {   
      tooltip.transition().duration(500).style("opacity", 0).style("display", "none");
    });  

}

// Update
function updateLineChart(radio) {
  rescale(radio);
  d3.csv("data/"+radio+".csv").then(function(data) {
    datasetLineChart = data;
    drawUS();
    drawFrance();
  });
}

function rescale(variety) {
  if (variety == "Bordeaux-style Red Blend") {
    yScaleLine.domain([0, 900]);
  }
  else if (variety == "Chardonnay") {
    yScaleLine.domain([0, 700]);
  }
  else if (variety == "Pinot Noir") {
    yScaleLine.domain([0, 600]);
  }
  svg2.select(".y_axis").call(d3.axisLeft(yScaleLine));
}
// =========================== End of Line Chart ==========================


// =========================== Part 3: Scatterplot ========================
var margin3 = {top: 20, right: 20, bottom: 50, left: 60};
var w3full = $('#graphic3').width();
var h3full = $('#graphic3').height();
var w3 = w3full - margin3.left - margin3.right;
var h3 = h3full - margin3.top - margin3.bottom;
var xScaleScatter = d3.scaleLinear().domain([0, 2500]).range([0, w3]);
var xValue = function(d) { return d.price; }
var yScaleScatter = d3.scaleLinear().domain([79, 100]).range([h3, 0]);
var yValue = function(d) { return d.points; }
var svg3, legend3;

// Set up svg, axes, and legend
svg3 = d3.select('#graphic3').append("svg").attr("width", w3full).attr("height", h3full)
  .append("g").attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
svg3.append("g")
  .attr("class", "x axis").attr("transform", "translate(0," + h3 + ")").call(d3.axisBottom(xScaleScatter));
svg3.append("g")
  .attr("class", "y_axis").call(d3.axisLeft(yScaleScatter));
svg3.append("text")
  .attr("transform", "rotate(-90)").attr("y", 0 - margin3.left + 10).attr("x", 0 - (h3 / 2)).attr("dy", "1em")
  .style("text-anchor", "middle").text("Rating");
svg3.append("text")
  .attr("transform", "rotate(0)").attr("y", h3 + 20).attr("x", w3/2).attr("dy", "1em")
  .style("text-anchor", "middle").text("Price $");
legend3 = svg3.selectAll('.legend').data(countries).enter().append('g')
  .attr('class', 'legend').attr('transform', function(d,i) { return 'translate(0,' + i * 20 + ')'; });
legend3.append('rect')
  .attr('x', w3 - 18).attr('width', 18).attr('height', 18).style('fill', function(d) { return color[d]; });
legend3.append('text')
  .attr('x', w3 - 24).attr('y', 9).attr('dy', '.35em')
  .style('text-anchor', 'end').text(function(d) { return d; });

// Load Data
d3.csv("data/US_France.csv").then(function(data) {
  svg3.selectAll(".dot").data(data).enter().append("circle")
  .attr("class", "dot")
  .attr("cx", function(d) { return xScaleScatter(d.price); })
  .attr("cy", function(d) { return yScaleScatter(d.points); })
  .attr("r", 3)
  .style("fill", function(d) { return color[d.country]; })
  .style("opacity", function(d) { return d.price < 1001 ? 0.25 : 1; })
  .style("stroke", function(d) { return d.price < 1001 ? 'none' : '#444'; })
  .on("mouseover", function(d) {
    tooltip.transition().duration(200).style("opacity", .9);
    tooltip.html(d["country"] + "<br/>" + d["variety"] + "<br/>" + "Rating: "+yValue(d) 
    + "<br/>" + "Price: $" + parseFloat(xValue(d)).toFixed(0))
      .style("left", (d3.event.pageX - 164) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("background-color", "white")
      .style("display", "block");
  })
  .on("mouseout", function(d) {
    tooltip.transition().duration(500).style("opacity", 0).style("display", "none");;
  });
});

// =========================== End of Scatterplot =========================

init();