var graphic1 = d3.select('#graphic1');
var graphic2 = d3.select('#graphic2');
var graphic3 = d3.select('#graphic3');
var text = d3.selectAll('.text');

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

init();

function update(index) {
  text.classed('is-active', function (d, i) {return i === index;});
  switch (index){
    case 0:
    case 1:
    case 2:
      updateGraphic1(index);
      break;
    case 3:
    case 4:
    case 5:
      updateGraphic2(index);
      break;
    case 6:
    case 7:
    case 8:
      updateGraphic3(index);
      break;
    default:
      break;
  }
}

// TODO: Replace the dummy code below
function updateGraphic1(index){
  graphic1.select('.bar-inner').style('width', d3.select('[data-index=\'' + index + '\']').attr('data-width'));
}

function updateGraphic2(index){
  graphic2.select('.bar-inner').style('width', d3.select('[data-index=\'' + index + '\']').attr('data-width'));
}

function updateGraphic3(index){
  graphic3.select('.bar-inner').style('width', d3.select('[data-index=\'' + index + '\']').attr('data-width'));
}