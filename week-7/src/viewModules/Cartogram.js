import * as d3 from "d3";

export default function drawCartogram(rootDom, data){

	const w = rootDom.clientWidth;
	const h = rootDom.clientHeight;

	const projection = d3.geoMercator()
		.translate([w/2, h/2])
		.scale(180);

	const scaleSize = d3.scaleSqrt()
		.domain([0,d3.max(data,d=>d.value)])
		.range([5,30]);

	const svg = d3.select(rootDom)
		.classed('cartogram',true)
		.selectAll('svg')
		.data([1]);
	const svgEnter = svg.enter()
		.append('svg');
	svgEnter
		.append('g').attr('class','plot');

	const plot = svg.merge(svgEnter)
		.attr('width', w)
		.attr('height', h)
		.select('.plot');

	const nodes = plot.selectAll(".node")
		.data(data, d=>d.key);

	const nodesEnter = nodes.enter()
		.append("g")
		.attr("class","node");

	nodesEnter.append("circle");

	nodesEnter.append("text")
		.attr("text-anchor","middle");

	nodes.merge(nodesEnter)
		.filter(d=>d.dest_lngLat)
		.attr("transform",d=>{
			const xy = projection(d.dest_lngLat);
			return `translate(${xy[0]}, ${xy[1]})`;
		})

	nodes.merge(nodesEnter)
		.select("circle")
		.attr("r", d => scaleSize(d.value))
		.style("fill-opacity", .03)
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("stroke-opacity", 0.3)

	nodes.merge(nodesEnter)
		.select("text")
		.attr("y", d => -scaleSize(d.value))
		.filter(d => d.value > 1000000)
		.text(d => d.key)
		.style("font-family", "sans-serif")
		.style("font-size", "10px")
		
	nodes.exit().remove();

}