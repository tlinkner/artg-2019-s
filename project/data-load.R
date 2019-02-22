library(tidyverse)
library(stringr)


demo <- read_csv("data/democracy_index_2018.csv")

glimpse(demo)

un <- read_csv("data/UNdata_Export_20190222_044811086.csv")

# remove numbered rows at the end, no year
un <- un[complete.cases(un$Year),]

glimpse(un)

unique(un$`Country or Area`)

unique(un$Religion)

r <- aggregate(Value ~ Religion, data = un, sum) %>% arrange(Value)

r[order(r$Value, decreasing=TRUE),]
