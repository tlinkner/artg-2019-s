const migrationDataPromise = d3.csv('../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
const countryCodePromise = d3.csv('../data/un-migration/ANNEX-Table 1.csv', parseCountryCode)
	.then(data => new Map(data));
const metadatPromise = d3.csv('../data/country-metadata.csv', parseMetadata);


// combine three Promises. ensures all data is loaded
Promise.all([
    migrationDataPromise,
    countryCodePromise,
    metadatPromise
  ])
  .then(([migration, countryCode, metadata]) => {

      const metadata_tmp = metadata.map(d => {
        return [d.iso_num, d]
      })

      const metadataMap = new Map(metadata_tmp);
      const migrationAugmented = migration.map(d => {
        // look code for origin
        const origin_code = countryCode.get(d.origin_name);
        const dest_code = countryCode.get(d.dest_name);
        // Go to metadata, look up region
        const origin_metadata = metadataMap.get(origin_code);
        const dest_metadata = metadataMap.get(dest_code);

        d.origin_code = origin_code;
        d.dest_code = dest_code;

        if(origin_metadata) {
          d.origin_subregion = origin_metadata.subregion;
        }
        if(dest_metadata) {
          d.dest_subregion = dest_metadata.subregion;
        }

        return d;
      });

      const migrationFiltered = migrationAugmented.filter(d=>d.origin_code ==="840");

      const usData = d3.nest()
        .key(d => d.year)
        .entries(migrationFiltered)
        .map(yearGroup => {
          return {
            year: +yearGroup.key, // ensure a number
            total: d3.sum(yearGroup.values, d => d.value), // pick prop out of sum
            max: d3.max(yearGroup.values, d => d.value),
            min: d3.min(yearGroup.values, d => d.value)
          }
        });

//      lineChart(
//        data, // us data we just filted
//        d3.select('.module').node() // selection + node
//      );

      // Group by subregion, then by year
      const subregionsData = d3.nest()
        .key(d => d.origin_subregion)
        .key(d => d.year)
        .rollup(values => d3.sum(values, d => d.value))
        .entries(migrationAugmented);

      console.log(subregionsData);

      d3.select('.chart-container')
        .selectAll('.chart') // 0 elems
        .data(subregionsData)
        .enter()
        .append('div') // if a deficit, create elems
        .attr('class','chart') // has a data friend, each region joined to a chart
        .each(function(d){
          console.log(d.values)
          console.log(this)
          lineChart(d.values, this);
        }) // takes a selection, iterate over items with bound data
        ;


  });


// Drawing a chart based on serial x-y data
// Function signature: expains wat args are expected and type
function lineChart(data, rootDOM){

  // need to make sure array is sorted


//  console.log("linechart");
//  console.log(data);
//  console.log(rootDOM);
  const W = rootDOM.clientWidth;
  const H = rootDOM.clientHeight;
  const margin = {t: 32,r: 32,b: 64, l: 64};
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

	const scaleX = d3.scaleLinear().domain([1985,2020]).range([0, innerWidth]);
	const scaleY = d3.scaleLinear().domain([0, 25000000]).range([innerHeight,0]);

  const axisX = d3.axisBottom()
    .scale(scaleX)
    .tickFormat(function(val){
      return "'"+String(val).slice(-2)
    });

  const axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(-innerWidth)
    .ticks(3);


  // temp hack to remove last elem
  data.pop();

  const lineGenerator = d3.line()
  .x(d => scaleX(d.key))
  .y(d => scaleY(d.value));

  const areaGenerator = d3.area()
  .x(d => scaleX(+d.key))
  .y0(innerHeight)
  .y1(d => scaleY(d.value));

  console.log(innerWidth);
  console.log(scaleX(1990));

  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  const plot = svg.append('g')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

  plot.append('path')
    .attr('class','line')
    .datum(data)
    .attr('d',d => lineGenerator(d))
    .attr('fill','none')
    .attr('stroke','red');

  plot.append('path')
    .attr('class','area')
    .datum(data)
    .attr('d',d => areaGenerator(d))
    .attr('fill','red')
    .attr('fill-opacity',0.3);

  plot.append('g')
    .attr('class','axis-x')
    .attr('transform',`translate(0,${innerHeight})`)
    .call(axisX);

  plot.append('g')
    .attr('class','axis-y')
    .call(axisY);


}


//Utility functions for parsing metadata, migration data, and country code
function parseMetadata(d){
	return {
		iso_a3: d.ISO_A3,
		iso_num: d.ISO_num,
		developed_or_developing: d.developed_or_developing,
		region: d.region,
		subregion: d.subregion,
		name_formal: d.name_formal,
		name_display: d.name_display,
		lngLat: [+d.lng, +d.lat]
	}
}

function parseCountryCode(d){
	return [
		d['Region, subregion, country or area'],
		d.Code.padStart(3,'0')
	]
}

function parseMigrationData(d){
	if(+d.Code >= 900) return;

	const migrationFlows = [];
	const dest_name = d['Major area, region, country or area of destination'];
	const year = +d.Year

	delete d.Year;
	delete d['Sort order'];
	delete d['Major area, region, country or area of destination'];
	delete d.Notes;
	delete d.Code;
	delete d['Type of data (a)'];
	delete d.Total;

	for(let key in d){
		const origin_name = key;
		const value = d[key];

		if(value !== '..'){
			migrationFlows.push({
				origin_name,
				dest_name,
				year,
				value: +value.replace(/,/g, '')
			})
		}
	}

	return migrationFlows;
}
