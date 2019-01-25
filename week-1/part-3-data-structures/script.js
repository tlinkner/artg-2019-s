//You'll show messages in the console using console.log
console.log("Week-1 part-3: data structures");

//Let's start with an array of objects, representing a selection of US cities
const data = [
  {"city":"seattle", "state":"WA", "population":652405, "land_area":83.9},
  {"city":"new york", "state":"NY", "population":8405837, "land_area":302.6},
  {"city":"boston", "state":"MA", "population":645966, "land_area":48.3},
  {"city":"kansas city", "state":"MO", "population":467007, "land_area":315}
];

//Complete the following exercises by following the prompts

function capitalize(s) {
  return s.replace(/\b\w/g, l => l.toUpperCase());
}

//#1
//Using array.forEach, print out (using console.log) the names of the 4 cities, followed by their population.
//The message should have the following sample format
//"seattle, WA has a population of 652405"
data.forEach(function(d){
	//YOUR CODE HERE
  console.log(`${capitalize(d.city)}, ${d.state} has a population of ${d.population}`);
});

//#2
//Using array.forEach to sum up the populations of the 4 cities
//and print out the average population of the 4 cities
let popsum = 0;
data.forEach(function(d){
  popsum += d.population;
});
let popavg = popsum / data.length;
console.log(`The total population is ${popsum}`);
console.log(`The average population is ${popavg}`);

//#3
//Sort these 4 cities in terms of land area, from highest to lowest
//And print out the name of the city with the largest land area
//Hint: use array.sort
const sortedByLand = data.sort(function(a, b){
  return b.land_area - a.land_area;
});
console.log(capitalize(sortedByLand[0].city));

//#4
//Using array.map, compute the population density of these 4 cities (population divided by area)
//add population density as a property to each object, and return the array
const popDensity = data.map(function(d){
  d.density = d.population / d.land_area;
  return d;
});
console.log(popDensity);

//#5
//Using array.filter, return a subset of the cities with a population <1 million
const smallerCities = data.filter(function(d){
  return d.population < 1000000;
});
console.log(smallerCities);
