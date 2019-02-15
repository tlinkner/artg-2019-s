

const redSquare  = d3.select('.main')
  .append('div')
  .classed('square',true)
  .style('background','red')
  .datum({key:4});

// binding an even listener to a particular event
redSquare.on('click',function(d){
    console.log("Red square is clicked");
    console.log(this); // context
    d3.select(this).style('background','lime');
    console.log(d); // data bound tot he object
  });
  
  
const blueSquare = d3.select('.main')
  .append('div')
  .classed('square',true)
  .style('background','blue')
  .on("click",d =>{
    console.log("Blue square is clicked");
    // ! one difference between arrow function ad normal, value of this is diffrent.
    console.log(this);
  });
  

const yellowSquare = redSquare
  .append('div')
  .classed('square',true)
  .style('background','yellow')
  .on("click",d =>{
    console.log("Yellow square is clicked");
    d3.event.stopPropagation();
    console.log(this);
    console.log(d3.event);
  });
  
  
// create a dispatch object
//  to handle change color event
// can have any number of events
const dispatch = d3.dispatch("change:color")

dispatch.on("change:color", function(color){
  console.log(color);
})

  

for (let i=0; i < 10; i++) {
  const randomColor = `rgb(`
    + `${Math.round(Math.random()*255)},`
    + `${Math.round(Math.random()*255)},`
    + `${Math.round(Math.random()*255)})`;
  const square = d3.select('.main')
    .append('div')
    .classed('square',true)
    .style('background',randomColor)
    // second arg is the context
    .on('click',d => dispatch.call("change:color", null ,randomColor))
    
//  dispatch.on("change:color."+i,function(color){
//    console.log("SQ Dispatch Func");
//    square.style("background",color);
//  });
    
//    .on('click',function(d){ 
//      // need awareness that others exist
//      // what if are no ther squares?
//      // makes a strong assumptin about what is on the page
//      d3.selectAll('.square').style('background',randomColor)
//    })
}

// Also works
dispatch.on("change:color."+"foo",function(color){
  d3.selectAll('.square').style("background",color);
});





//d3.selectAll('.square')
//  .on('click',function(d){
//    d3.select('square').style();
//  
//  });


