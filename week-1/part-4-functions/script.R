library(tools)
library(tidyverse)
library(jsonlite)
library(reshape2)

data <- read.csv('../../data/world-bank/cb704cf4-fe8f-4f1b-ae0c-2a51c26f295f_Data.csv')

# parse wide to long
data <- melt(data, id.vars = 1:4, measure.vars = 5:11, variable.name = "year", value.name = "value")
data$year <- as.character(data$year) %>% substr(2,5)
# remove code
data$Series.Code <- NULL
# rename columns
names(data) <- c("countryName", "countryCode", "series", "year", "value")


#Exercise starts here
#Define a function that takes three arguments
# - rows: the "rows" variable from above
# - three letter country code, such as "AUT"
# - series name, such as "Population, total"
#And return small array of values, sorted by year

# one-liner
filteredData <- data[data$countryCode == "BHR" & data$series == "Population, total",]

# ERROR
# alternately apply a function
#filterByCountrySeries <- function(rows, country, series){
#  return("Foo")  
#}
#
#filterByCountrySeries <- lapply(data, filterByCountrySeries, "BHR", "Population, total")



