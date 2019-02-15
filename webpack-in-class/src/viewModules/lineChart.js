import * as d3 from 'd3';

function LineChart(){

	let maxY;
  
  const bisect = d3.bisector(d => d.key).right; // this gives us a function
  let cb;

	function exportFunction(data, rootDOM){

		const W = rootDOM.clientWidth;
		const H = rootDOM.clientHeight;
		const margin = {t:32, r:32, b:64, l:64};
		const innerWidth = W - margin.l - margin.r;
		const innerHeight = H - margin.t - margin.b;

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
			.data([1]) // hack: want to use a version of enter/exit/update
      // so never more than one of these drawn
		const svgEnter = svg.enter()
			.append('svg');
		svg.merge(svgEnter)
			.attr('width', W)
			.attr('height', H);

		//Append rest of DOM structure in the enter selection
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
    plotEnter.append('rect')
      .attr('class','mousetarget')
      .attr('width',innerWidth)
      .attr('height',innerHeight)
      .style('opacity',0.01);
    const tooltipEnter = plotEnter.append('g')
      .attr('class','tool-tip');
    tooltipEnter.append('circle').attr('r',3);
    tooltipEnter.append('text')
      .attr('dy',-10);

		//Update the update + enter selections
		const plot = svg.merge(svgEnter).select('.plot');

		plot.select('.line')
			.datum(data)
			.transition()
			.attr('d', data => lineGenerator(data))
		plot.select('.area')
			.datum(data)
			.transition()
			.attr('d', data => areaGenerator(data))
		plot.select('.axis-x')
			.transition()
			.call(axisX)
		plot.select('.axis-y')
			.transition()
			.call(axisY);
      
      
    // Event handline
    
    plot
      .select('.area')
      .on("mouseenter", function(d){
  //      console.log("mouseenter");
      })
      .on("mousemove",function(d){
  //      console.log(this);
  //      console.log(d); // the hack. see line 39
        const mouse = d3.mouse(this);
        const mouseX = mouse[0];
        const year = scaleX.invert(mouseX);
        const idx = bisect(data, year); // number is the index
        const datum = data[idx];
        
        console.log(data[idx]); 
        
        plot.select('.tool-tip')
          .attr('transform',`translate(${scaleX(datum.key)}, ${scaleY(datum.value)})`)
          .select('text')
          .text(datum.value);
          
          cb(dataum.key);
        
      })
      .on("mouseleave", function(d){
  //      console.log("mouseleave");
      });
    

	}

	exportFunction.maxY = function(_){
		maxY = _;
		return this;
	}

  exportFunction.on = function(event, callback) {
    cb = callback;
    return this;
  }

	return exportFunction;

}


export default LineChart;