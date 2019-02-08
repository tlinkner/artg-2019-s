import './style.css';

import * as d3 from 'd3';

import {parseMetadata,parseCountryCode,parseMigrationData} from './utils';
import {migrationDataPromise,countryCodePromise,metadataPromise} from './data';
import lineChart from './viewModules/lineChart';

// --------------------------------------------------------


Promise.all([
		migrationDataPromise,
		countryCodePromise,
		metadataPromise
	])
	.then(([migration, countryCode, metadataMap]) => { // renaming happens here

// Problem:
// Group by origin
// Filter by subregion
// ? For any given country, what are the migrations for subregions
// Ex. American migraion to subregions of the world.
// Filter by origin code: 840 = US



    // data restructuring logic, could move this out.
		const migrationAugmented = migration.map(d => {

			const origin_code = countryCode.get(d.origin_name);
			const dest_code = countryCode.get(d.dest_name);

			d.origin_code = origin_code;
			d.dest_code = dest_code;

			//Take the 3-digit code, get metadata record
			const origin_metadata = metadataMap.get(origin_code);
			const dest_metadata = metadataMap.get(dest_code);

			if(origin_metadata){
				d.origin_subregion = origin_metadata.subregion;
			}
			if(dest_metadata){
				d.dest_subregion = dest_metadata.subregion;
			}

			return d;
		});

// select menu



		//Migration from the US (840) to any other place in the world
		//filter the larger migration dataset to only the subset coming from the US
		// const migrationFiltered = migrationAugmented.filter(d => d.origin_code === "840"); //array of 1145 individual flows

    const data = transform("840",migrationAugmented);

    render(data);

      // Build UI for select menu
      // console.log(countryCode);
      // Need to be able to iterate each element in this list
      // Need to make an array out of a map
      const countryList = Array.from(countryCode.entries());
      console.log(countryList);

      const menu = d3.select('.nav')
        .append('select');
      menu.selectAll('option')
        .data(countryList) // deficit, need to make up entries
        .enter() // make up missing elems
        .append('option')
        .attr('value',d => d[1])
        .html(d => d[0]);

      // Define behavior
      menu.on('change', function(){
        // console.log(this.value);
        // console.log(this.selectedIndex); // from the index can reverse into display name
        const code = this.value;
        const idx = this.selectedIndex;
        const display = this.options[idx].innerHTML;

        const data = transform(code,migrationAugmented);
        render(data);
        // console.log(transform(code,migrationAugmented));
        // need to rerun the rendering part

        // console.log(display);
      }); // why switching to old notation?

	});

// filter and nest
// needs 3 letter code
// needs migration dataset
// returns filtered output
// should really go in the utility module
function transform(code, migration){ // function signature

  const filteredData = migration.filter(d => d.origin_code === code);

  //group by subregion
  const subregionsData = d3.nest()
    .key(d => d.dest_subregion)
    .key(d => d.year)
    .rollup(values => d3.sum(values, d => d.value))
    .entries(filteredData);

  return subregionsData;
}


function render(data){

  const charts = d3.select('.chart-container')
            .selectAll('.chart')
            .data(data);

  // 3 outsomes: enter, update, exit
  const chartsEnter = charts.enter()
    .append('div')
    .attr('class','chart');

  // exit
  charts.exit().remove();

  // update and enter
  // charts.merge(chartsEnter)
  //   .each(function(d){
  //     lineChart(
  //       d.values, //array of 7
  //       this
  //     );

  //
  // d3.select('.main')
  //   .selectAll('.chart') //0
  //   .data(data)
  //   .enter() // only dealing with the enter part, forgot update
  //   .append('div')
  //   .attr('class','chart')
  //   });

}




// ========================================================

function foo(val){
  console.log(`foo ${val}`);
}
foo(123);

const bar = function(val){
  console.log(`bar ${val}`);
}
bar(456);
