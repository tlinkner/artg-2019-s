library(tools)
library(tidyverse)
library(jsonlite)

#You'll show messages in the console using console.log

#Let's start with an array of objects, representing a selection of US cities
data.json <- '[
  {"city":"seattle", "state":"WA", "population":652405, "land_area":83.9},
  {"city":"new york", "state":"NY", "population":8405837, "land_area":302.6},
  {"city":"boston", "state":"MA", "population":645966, "land_area":48.3},
  {"city":"kansas city", "state":"MO", "population":467007, "land_area":315}
]'
data <- fromJSON(data.json)

#Complete the following exercises by following the prompts

##1
#Using array.forEach, print out (using console.log) the names of the 4 cities, followed by their population.
#The message should have the following sample format
#"seattle, WA has a population of 652405"
print(paste(toTitleCase(data$city),",",data$state," has a population of", data$population))

##2
#Using array.forEach to sum up the populations of the 4 cities
#and print out the average population of the 4 cities
sum(data$population)
mean(data$population)

##3
#Sort these 4 cities in terms of land area, from highest to lowest
#And print out the name of the city with the largest land area
#Hint: use array.sort
dataByLandArea <- data[order(data$land_area, decreasing = TRUE),"city"] %>%
  toTitleCase %>%
  print

##4
#Using array.map, compute the population density of these 4 cities (population divided by area)
#add population density as a property to each  object, and return the array
data$density <- data$population / data$land_area %>%
  print

##5
#Using array.filter, return a subset of the cities with a population <1 million
data[data$population < 1000000,]

