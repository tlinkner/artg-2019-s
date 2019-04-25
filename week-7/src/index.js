import './style.css';
import * as d3 from "d3";
import {migrationDataPromise,countryCodePromise,metadataPromise} from './data';
import Cartogram from './viewModules/Cartogram';



// ----------------------------------------------

const globalDispatch = d3.dispatch("change:year");

const title = d3.select('.page-title')
	.insert('h1', '.cartogram-container')
	.html('...');

globalDispatch.on('change:year', (data, year) => {
	title.html(year);
	const filteredData = data.filter( d=>d.year===+year);
	renderCartogram(filteredData);
});



// ----------------------------------------------

Promise.all([migrationDataPromise,countryCodePromise,metadataPromise])
	.then(([migration, countryCode, metadataMap]) => {

		// year menu
		const years = d3.nest()
			.key(d=>d.year)
			.entries(migration)
			.map(d=>{
				if (d.key > 0){return d.key}
			});
			
		const menu = d3.select('.nav').append('select');
		menu.selectAll('option')
			.data(years)
			.enter()
			.append('option')
			.attr('value', d => d)
			.html(d => d);
		menu.on('change', function(){
			globalDispatch.call('change:year',null,migrationAugmented,this.value);
		});
		
		// prep data
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
				d.origin_lngLat = origin_metadata.lngLat;
			}
			if(dest_metadata){
				d.dest_subregion = dest_metadata.subregion;
				d.dest_lngLat = dest_metadata.lngLat;
			}

			return d;
		});

		// initial render view modules
		globalDispatch.call('change:year',null,migrationAugmented,1990);
});



// ----------------------------------------------

function renderCartogram(data){
  const cartogram = Cartogram()
    .width(800)
    .height(600);

	d3.select('.cartogram-container')
		.each(function(){
			cartogram(this, data);
		});
}


