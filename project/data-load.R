library(tidyverse)
library(stringr)
library(readxl)
library(gplots)
library(corrgram)



# Where did this come from? Need to identify source
democracyIndex <- read_csv("data/democracy_index_2018.csv")
glimpse(democracyIndex)


# ---------------------------------------------------------

# Where did this come from? Need to identify source
religion <-  read_excel("data/Religious_Composition_by_Country_2010-2050.xlsx", col_names = TRUE)
glimpse(religion)

# What to do about < 10,000? 
religion$row_number <- NULL

# Only need level 1, not regional data
religion <- religion[religion$level == 1,]
religion$level <- NULL

# Don't need nation foreign key
religion$Nation_fk <- NULL

# Only need 2010 values
religion$Year <- as.numeric(religion$Year)
unique(religion$Year)
religion <- religion[religion$Year == 2010,]
religion$Year <- NULL

# Clean numbers. What to do about < 10,000? 
religion$Christians <- str_replace_all(religion$Christians, ",","") %>% as.numeric
religion$Muslims <- str_replace_all(religion$Muslims, ",","") %>% as.numeric
religion$Unaffiliated <- str_replace_all(religion$Unaffiliated, ",","") %>% as.numeric
religion$Hindus <- str_replace_all(religion$Hindus, ",","") %>% as.numeric
religion$Buddhists <- str_replace_all(religion$Buddhists, ",","") %>% as.numeric
religion$`Folk Religions` <- str_replace_all(religion$`Folk Religions`, ",","") %>% as.numeric
religion$`Other Religions` <- str_replace_all(religion$`Other Religions`, ",","") %>% as.numeric
religion$Jews <- str_replace_all(religion$Jews, ",","") %>% as.numeric
religion$`All Religions` <- str_replace_all(religion$`All Religions`, ",","") %>% as.numeric

# merge
democracyIndexReligion <- merge(democracyIndex, religion, by="Country")


# ---------------------------------------------------------

# Check matches
dc <- unique(democracyIndex$Country)
rc <- unique(religion$Country)

# intersection of dataframes
intersect <- intersect(dc,rc) 
length(intersect)
# 162
             


# ---------------------------------------------------------

dr <- merge(democracyIndex, religion, by="Country")

# normalize as percent of all religions
dr$Christians <- dr$Christians / dr$`All Religions`
dr$Muslims <- dr$Muslims / dr$`All Religions`
dr$Unaffiliated <- dr$Unaffiliated / dr$`All Religions`
dr$Hindus <- dr$Hindus / dr$`All Religions`
dr$Buddhists <- dr$Buddhists / dr$`All Religions`
dr$`Folk Religions` <- dr$`Folk Religions` / dr$`All Religions`
dr$`Other Religions` <- dr$`Other Religions` / dr$`All Religions`
dr$Jews <- dr$Jews / dr$`All Religions`

# not so good. seems to confirm stereotypes: 
# - islam is anticorrlated with democracy
# - christianity is correclated with democracy
corrgram(dr, upper.panel=panel.pts, lower=panel.pie)

# What about for the most populous countries?
# What about region?


above <- democracyIndexReligion[democracyIndexReligion$Score > 5,]

arrange(above, desc(Muslims))

corrgram(above, upper.panel=panel.pts, lower=panel.pie)

# what about plurality?



#cor_tbl <- cor(dr$Score,dr[,firstCol:lastCol], use == "complete.obs")
#heatmap(dr)
# plot(dr$Score,dr$Christians)
# plot(dr$Score,dr$Muslims)
# 
# firstCol <- which(colnames(dr) == "Christians")
# lastCol <- which(colnames(dr) == "Jews")
# 
# un <- read_csv("data/UNdata_Export_20190222_044811086.csv")
# remove numbered rows at the end, no year
# un <- un[complete.cases(un$Year),]
# glimpse(un)
# unique(un$`Country or Area`)
# unique(un$Religion)
# r <- aggregate(Value ~ Religion, data = un, sum) %>% arrange(Value)
# r[order(r$Value, decreasing=TRUE),]
