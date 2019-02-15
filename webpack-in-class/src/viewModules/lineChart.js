import * as d3 from 'd3';


function LineChart(){

  let maxY;

  function exportFunction(data, rootDOM){
  console.log("lineChart");

    //data
    //[{}, {}, {}...]x7

    const W = rootDOM.clientWidth;
    const H = rootDOM.clientHeight;
    const margin = {t:32, r:32, b:64, l:64};
    const innerWidth = W - margin.l - margin.r;
    const innerHeight = H - margin.t - margin.b;

    // Could ptobebly move this somewhere else b/c runs often
    const scaleX = d3.scaleLinear().domain([1985,2020]).range([0, innerWidth]);
    const scaleY = d3.scaleLinear().domain([0, maxY]).range([innerHeight, 0]);

    //take array of xy values, and produce a shape attribute for <path> element
    const lineGenerator = d3.line()
      .x(d => scaleX(+d.key))
      .y(d => scaleY(d.value)); //function
    const areaGenerator = d3.area()
      .x(d => scaleX(+d.key))
      .y0(innerHeight)
      .y1(d => scaleY(d.value));

    const axisX = d3.axisBottom()
      .scale(scaleX)
      .tickFormat(function(value){ return "'"+String(value).slice(-2)})

    const axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-innerWidth)
      .ticks(3)

    const svg = d3.select(rootDOM)
      .classed('line-chart',true)
      .selectAll('svg')
      .data([1]); // ensure that there is always only 1 svg element

    const svgEnter = svg.enter()  
      .append('svg')
    svg.merge(svgEnter)
      .attr('width', W)
      .attr('height', H);    

    // append rest of dom structure
    const plotEnter = svgEnter.append('g')
      .attr('class','plot')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    plotEnter.append('path')
      .attr('class','line')
      .style('fill','none')
      .style('stroke','#333')
      .style('stroke-width','2px')

    plotEnter.append('path')
      .attr('class','area')
      .style('fill-opacity',0.03)

    plotEnter.append('g')
      .attr('class','axis axis-x')
      .attr('transform',`translate(0, ${innerHeight})`)

    plotEnter.append('g')
      .attr('class','axis axis-y')

    // merge enter and update
    const plotEnterUpdate = svg.merge(svgEnter)
      .select('.plot'); 

    plotEnterUpdate.select('.line')
      .datum(data)
      .transition()
      .attr('d', data => lineGenerator(data));
    plotEnterUpdate.select('.area')
      .datum(data)
      .transition()
      .attr('d', data => areaGenerator(data));
    plotEnterUpdate.select('.axis-x')
      .transition()
      .call(axisX);
    plotEnterUpdate.select('.axis-y')
      .transition()
      .call(axisY);

  }
  
  exportFunction.maxY = function(_){
    maxY = _;
    return this;
  }
  
  return exportFunction;
}



export default LineChart;