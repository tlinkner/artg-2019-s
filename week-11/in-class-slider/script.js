console.log("Hi.");

// Sider with snap
// DOM + interaction
// Data drives range scale
// tack, handle, axis
// encapsulate in a function
// configurable
// - ranges
// - behavior
//
// Will use dispatches

// API for slider
// 

// Factory funciton
// Call funciton A, functon B is a product
// Funciton A can customize: scale

// d3.select(...).call(functionB);
// funcitonB elements willbe drawn within selection

// Equivalent
//d3.select(...).call(x);
//x(d3.select(...));

// All code in examples

// Write the API: how a facotry stamps out copies



function RangeSlider(){ // funtion A

  let color = "#ccc";
  let sliderValues = [];

  function exports(container){ // function B
  
    let svg = container.selectAll("svg")
      .data(1); // hack
    let svgEnter = svg.enter()
      .append("svg");
      
    let sliderInner = svgEnter.append("g")
      .attr("class","range-slider-inner")
		sliderInner.append('line').attr('class', 'track-outer');
		sliderInner.append('line').attr('class', 'track-inner');
		sliderInner.append('circle').attr('class', 'drag-handle');
		sliderInner.append('g').attr('class', 'axis');
      
    
    // enter
    
    // update
    
    // exit
  
    // build dom elements for slider: track, circle, axis
    // color
    // return color;
  }
  
  // getter/setter pattern
  exports.color = function(_){
    if(!_) {
      return color; // get
    }
    color = _; // set
    return this; // so not undefined, allows us to chain
  }
  
  exports.values = function(_){
    if(!_){
      return sliderValues;
    }
    sliderValues = _;
    return this; // gives access to the owner
  }
  
  return exports;
}

const slider1 = RangeSlider() // returns a function
  .color("red")
  .values([1,2,3,4,5]);

slider1(d3.select(".slider_container"));






//const foo = RangeSlider()
//  .color('#f00')
//  .values([1,2,3,4,5]);
//
//console.log(foo());



