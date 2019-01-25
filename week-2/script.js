const migrationDataPromise = d3.csv('../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
const countryCodePromise = d3.csv('../data/un-migration/ANNEX-Table 1.csv', parseCountryCode)
	.then(data => new Map(data));
<<<<<<< HEAD
const metadataPromise = d3.csv('../data/country-metadata.csv', parseMetadata);

Promise.all([
		migrationDataPromise,
		countryCodePromise,
		metadataPromise
	])
	.then(([migration, countryCode, metadata]) => {

		//Convert metadata to a map
		const metadata_tmp = metadata.map(a => {
			return [a.iso_num, a]
		});
		const metadataMap = new Map(metadata_tmp);

		const migrationAugmented = migration.map(d => {

			const origin_code = countryCode.get(d.origin_name);
			const dest_code = countryCode.get(d.dest_name);

			d.origin_code = origin_code;
			d.dest_code = dest_code;

			//Take the 3-digit code, get metadata record
			const origin_metadata = metadataMap.get(origin_code);
			const dest_metadata = metadataMap.get(dest_code);

			// if(!origin_metadata){
			// 	console.log(`lookup failed for ` + d.origin_name + ' ' + d.origin_code);
			// }
			// if(!dest_metadata){
			// 	console.log(`lookup failed for ${d.origin_name} ${d.origin_code}`)
			// }
			if(origin_metadata){
				d.origin_subregion = origin_metadata.subregion;
			}
			if(dest_metadata){
				d.dest_subregion = dest_metadata.subregion;
			}

			return d;
		});
		
		console.log(migrationAugmented);

	})
=======
const metadatPromise = d3.csv('../data/country-metadata.csv', parseMetadata);


// combine three Promises. ensures all data is loaded
Promise.all([
    migrationDataPromise, 
    countryCodePromise, 
    metadatPromise
  ])
  .then(([migration, countryCode, metadata]) => {
//    console.log(migration);
//    console.log(countryCode);
//    console.log(metadata);

      // group by year
      // write our data at each point, structure and count
//      const years = d3.nest()
//        .key(d => d.year)
//        .entries(migration)
//        .map(a => {
//          return {
//            year: a.key,
//            total: d3.sum(a.values, d => d.value),
//            value: a.values
//          }
//        });
//      console.log(years);

//    const originCountries = d3.nest()
//      .key( d => d.origin_name)
//      .entries(migration)
//      .map(a => a.key);


  // filter
//    const migrationFromUs = migration
//      .filter(d => d.origin_name === 'United States of America')
//      .filter(d => d.dest_name === 'Cuba')
//      .filter(d => d.year === 2000);
//    console.log(migrationFromUs);


// Key 

//      console.log(migration);
//      console.log(countryCode);
//      console.log(metadata);
      
      
      // Convet metatdata to a map
//      console.log(metadata);
      
      const metadata_tmp = metadata.map(d => {
        return [d.iso_num, d]
      })
      
//      console.log(metadata_tmp);
      
      const metadataMap = new Map(metadata_tmp);
      
//      console.log(metadataMap);

      // From migration, take country name, 
      // Go to country code, look up code
      const migrationAugmented = migration.map(d => {
        // look code for origin 
        const origin_code = countryCode.get(d.origin_name);
        const dest_code = countryCode.get(d.dest_name);
        // Go to metadata, look up region
        const origin_metadata = metadataMap.get(origin_code);
        const dest_metadata = metadataMap.get(dest_code);
        
//        if (!origin_metadata) {
//          console.log(`lookup failed for ${d.origin_name} ${origin_code}`)
//        }
        
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
      console.log(migrationAugmented);
      
      
      
  });


/* 
 * DATA DISCOVERY
 */

// Convert metadata into a map, with ISO_num as the key
// Then console.log the metadata map and observe its structure

// console.log countryCode map and observe its structure

// For the migration dataset, how many years does it cover? How many origin countries? How many destination countries?

// Let's filter this the migration dataset
// How many people from the U.S. lived in Japan in the year 1995?

// How many people from the U.S. lived abroad in the year 1995?

// How many people from the U.S. lived aborad in all the years in the dataset?

// How many people from abroad lived in the U.S. in all the years in the dataset?

/* 
 * DATA TRANSFORMATION
 */
// Join the migration dataset with countryCode

// Further join the dataset with region and subregion

// Nest/group data by subregion, and produce time-series data for each subregion

>>>>>>> e1a1f5293c0052592d35a26c846f77df7fb95ca5


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
<<<<<<< HEAD
		d.Code.padStart(3, '0')
=======
		d.Code.padStart(3,'0')
>>>>>>> e1a1f5293c0052592d35a26c846f77df7fb95ca5
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