library(tidyverse)
library(plyr)
library(readxl)

# combine all csv files in the project into one dataframe
allData <- list.files(pattern = "*.csv", recursive = TRUE) %>%
  lapply(function(x) read_csv(x, col_names=TRUE, skip=1)) %>% 
  as.data.frame

# The columns you want to keep
cols <- c(
  "term",
  "int_rate",
  "grade",
  "purpose",
  "issue_d",
  "addr_state",
  "total_pymnt"
)

filteredData <- allData[,cols]
