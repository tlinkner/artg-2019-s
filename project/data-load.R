library(tidyverse)
library(stringr)
library(readxl)
library(gplots)
library(corrgram)
library(jsonlite)
library(entropy) # entropy
library(vegan) # diversity
library(gtools) # na_replace
library(reshape2)


# ---------------------------------------------------------
# Load democracy index data
# https://www.eiu.com/topic/democracy-index
democracyIndex <- read_csv("data/democracy_index_2018.csv")
glimpse(democracyIndex)


# ---------------------------------------------------------
# Load religion data
# https://www.pewforum.org/2015/04/02/religious-projection-table/

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
# Religions by percent

dr <- merge(democracyIndex, religion, by="Country")

# normalize as percent of all religions
dr$ChristiansPct <- dr$Christians / dr$`All Religions`
dr$MuslimsPct <- dr$Muslims / dr$`All Religions`
dr$UnaffiliatedPct <- dr$Unaffiliated / dr$`All Religions`
dr$HindusPct <- dr$Hindus / dr$`All Religions`
dr$BuddhistsPct <- dr$Buddhists / dr$`All Religions`
dr$FolkReligionsPct <- dr$`Folk Religions` / dr$`All Religions`
dr$OtherReligionsPct <- dr$`Other Religions` / dr$`All Religions`
dr$JewsPct <- dr$Jews / dr$`All Religions`


# ---------------------------------------------------------
# Correlation
# not so good. seems to confirm stereotypes: 
# - islam is anticorrlated with democracy
# - christianity is correclated with democracy
pctCols <- c(
  "Score",
  "Electoral process and pluralism",
  "Functioning of government",
  "Political participation",
  "Political culture",
  "Civil liberties",
  "ChristiansPct",
  "MuslimsPct",
  "UnaffiliatedPct",
  "HindusPct",
  "BuddhistsPct",
  "FolkReligionsPct",
  "OtherReligionsPct",
  "JewsPct"
)

cntCols <- c(
  "Score",
  "Electoral process and pluralism",
  "Functioning of government",
  "Political participation",
  "Political culture",
  "Civil liberties",
  "Christians",
  "Muslims",
  "Unaffiliated",
  "Hindus",
  "Buddhists",
  "Folk Religions",
  "Other Religions",
  "Jews"
)

corrgram(dr[,pctCols], upper.panel=panel.pts, lower=panel.pie, main="Correlation by Composition (Percent)")
corrgram(dr[,cntCols], upper.panel=panel.pts, lower=panel.pie, main="Correlation by Count")


# ---------------------------------------------------------
# Correlation
# What about only index scores above 5?
# - less pronounced muslim anticorrelation 
# - less pronounced christian correlation

drDemocracies <- dr[democracyIndexReligion$Score > 5,]

drDemocracies <- arrange(drDemocracies, desc(Muslims))

corrgram(drDemocracies, upper.panel=panel.pts, lower=panel.pie)

# population vs composition?

drPopMuslim <- merge(democracyIndex, religion, by="Country")
drPopMuslim <- arrange(drPopMuslim, desc(Muslims))
drPopMuslim <- drPopMuslim[1:10,]

corrgram(drPopMuslim, upper.panel=panel.pts, lower=panel.pie)


# What about for the most populous countries?
# What about region?

# ---------------------------------------------------------
# Diversity, plurality, entropy
# what about plurality?
# as a hack, use sd as an indicaiton of plurality

startCol <- which(colnames(dr) == "Christians")
endCol <- which(colnames(dr) == "Jews")

dr$sd <- apply(dr[,startCol:endCol],1,sd, na.rm=TRUE)

isNaEntropy <- function(data) {
  data <- data[!is.na(data)]
  return(entropy(data))
}

dr$entropy <- apply(dr[,startCol:endCol],1,isNaEntropy)

head(arrange(dr, desc(`All Religions`)), n=10)


# ---------------------------------------------------------
# Save

write_json(dr,"democray_religion_wide.json")

dr_long <- gather(dr[,startCol:endCol], key="religion", value="percent")

dr_long <- melt(
  dr, 
  id.vars = c(1:10,20:21),
  measure.vars = startCol:endCol,
  variable.name = "religion",
  value.name = "percent"
) # convert to long format

write_json(dr_long,"democray_religion_long.json")


write_json(democracyIndexReligion,"democray_religion_count_long.json")




# ---------------------------------------------------------
# shannon diversity?
# probability that two randomly selected individuals in the habitat belong to the same species
# 
# us <- dr[dr$Country=="United States",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.omit
# 
# diversity(us$percent, index = "shannon")
# 
# us <- dr[dr$Country=="United States",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.replace(0)
# 
# diversity(us$percent, index = "shannon")
# 
# india <- dr[dr$Country=="India",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.omit
# 
# diversity(india$percent, index = "shannon")
# 
# india <- dr[dr$Country=="India",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.replace(0)
# 
# diversity(india$percent, index = "shannon")
# 
# # without na
# norway <- dr[dr$Country=="Norway",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.omit
# 
# diversity(norway$percent, index = "shannon")
# 
# # with na as 0
# norway <- dr[dr$Country=="Norway",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.replace(0)
# 
# # na and zeros don't matter
# diversity(norway$percent, index = "shannon")
# 
# china <- dr[dr$Country=="China",startCol:endCol] %>% 
#   gather(key="religion", value="percent") %>%
#   na.omit
# 
# diversity(china$percent, index = "shannon")
# 
# 
# diversity(c(1,1,1,1,1), index = "shannon")
# diversity(c(1,1,1,1,1,1,1,1,1,1,1), index = "shannon")
# diversity(c(1,7,2,9,0), index = "shannon")
# 
# sd(c(1,1,1,1,1))
# sd(c(1,1,1,1,1,1,1,1,1,1,1))
# sd(c(1,7,2,9,0))


# What do I want to show?
# first democracy index...
# breakdown?
# filter by 

# cut = cat
# clarity = cat

ggplot(data=diamonds, aes(x=cut, fill=clarity)) + geom_bar(position="fill")

glimpse(diamonds)


ggplot(data=dr_long, aes(x=reorder(Country, percent), y=percent, fill=religion)) + 
  geom_bar(position="fill", stat="identity") + 
  coord_flip()

ggplot(data=dr_long, aes(x=reorder(Region, percent), y=percent, fill=religion)) + 
  geom_bar(position="fill", stat="identity") + 
  coord_flip()

dr$Category <- as.factor(dr$Category)
levels(dr$Category) <- c("Full democracy","Flawed democracy","Hybrid regime","Authoritarian")

ggplot(data=dr[,c("Region","Category")], aes(x=reorder(Region, Category), fill=Category)) + 
  geom_bar(position="fill") + 
  coord_flip()

ggplot(data=dr[,c("Region","Category")], aes(x=reorder(Region, Category), fill=Category)) + 
  geom_bar() + 
  coord_flip()


ssa <- dr[dr$Region=="Sub-Saharan Africa",]

ggplot(data=ssa[,c("Country","Category")], aes(x=reorder(Country, Category), fill=Category)) + 
  geom_bar() + 
  coord_flip()

# tabulate # countries per region
c <- d.wide[,c("Country","Region")]
aggregate(Country ~ Region, data=c, FUN=sum)

table(c)
