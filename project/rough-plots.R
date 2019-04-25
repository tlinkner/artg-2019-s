library(tidyverse)
library(stringr)
library(gplots)
library(corrgram)
library(jsonlite)


d.long <- read_json("democray_religion_long.json", simplifyVector=TRUE)
d.wide <- read_json("democray_religion_wide.json", simplifyVector=TRUE)
d.count <- read_json("democray_religion_count_long.json", simplifyVector=TRUE)

d.count$Category <-  factor(d.count$Category, levels=c("Full democracy","Flawed democracy","Hybrid regime","Authoritarian"))


d.long <- arrange(d.long, desc(Score))

ggplot(d.wide, aes(x=reorder(Country, Score), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip()

# show democracy by musim countries

d.muslim <- subset(d.wide, Muslims > 0.5)
d.count <- d.count

d.christian <- subset(d.wide, Christians > 0.5)

# Good
ggplot(d.wide, aes(x=reorder(Country, Score), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() + 
  labs(title="All countries orded by Democracy Index", x="Country", y="Democracy Index Rating")

# Good
ggplot(d.muslim, aes(x=reorder(Country, Score), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="> 50% Muslim countries orded by Democracy Index", x="Country", y="Democracy Index Rating")

# Good
ggplot(d.christian, aes(x=reorder(Country, Score), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="> 50% Christian countries orded by Democracy Index", x="Country", y="Democracy Index Rating")

# Good
ggplot(d.wide, aes(x=reorder(Country, entropy), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() + 
  labs(title="All countries orded by Democracy Index sorted by Entropy", x="Country", y="Democracy Index Rating")

#
d.wide$Region <- as.factor(d.wide$Region)

ggplot(d.wide, aes(x=reorder(Country, sd), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() + 
  labs(title="All countries orded by Democracy Index sorted by SD", x="Country", y="Democracy Index Rating")



ggplot(d.wide, aes(x=reorder(Country, Region), y=Score, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() + 
  labs(title="All countries orded by Democracy Index sorted by Region", x="Country", y="Democracy Index Rating")



# Good
ggplot(d.count, aes(x=reorder(Country, Muslims), y=Muslims, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All countries orded by Muslim Population", x="Country", y="Muslim Population")

# Good
ggplot(d.count, aes(x=reorder(Country, Christians), y=Christians, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All countries orded by Christians Population", x="Country", y="Christian Population")

# Good
ggplot(d.wide, aes(x=reorder(Country, Muslims), y=Muslims, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All countries orded by Muslim Composition", x="Country", y="Muslim Composition (Percent)")

# Good
ggplot(d.wide, aes(x=reorder(Country, Christians), y=Christians, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All countries orded by Christians Composition", x="Country", y="Christian Composition (Percent)")


# =========================================================
# democracy totals per religion

aggCols <- c(
  "Category",
  "Christians",
  "Muslims",
  "Hindus",
  "Other Religions",
  "Unaffiliated",
  "Folk Religions",
  "Buddhists",
  "Jews"  
)

# agD <- d.count[,aggCols]
# agD$Category <- as.factor(agD$Category)
# 
# ag <- aggregate(. ~ Category, sum, data=agD) %>% as.data.frame
# 
# ggplot(ag, aes(x=))


ag.christians <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Christians")]) %>% as.data.frame

ggplot(ag.christians, aes(x=factor(Category), y=Christians)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Christians by Index Cateogy")

ag.muslims <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Muslims")]) %>% as.data.frame

ggplot(ag.muslims, aes(x=factor(Category), y=Muslims)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Muslims by Index Cateogy")

ag.hindus <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Hindus")]) %>% as.data.frame

ggplot(ag.hindus, aes(x=factor(Category), y=Hindus)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Hindus by Index Cateogy")

ag.other <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Other Religions")]) %>% as.data.frame

ggplot(ag.other, aes(x=factor(Category), y=`Other Religions`)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Other Religions by Index Cateogy")

ag.unaffiliated <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Unaffiliated")]) %>% as.data.frame

ggplot(ag.unaffiliated, aes(x=factor(Category), y=`Unaffiliated`)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Unaffiliated by Index Cateogy")

ag.folk <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Folk Religions")]) %>% as.data.frame

ggplot(ag.folk, aes(x=factor(Category), y=`Folk Religions`)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Folk Religions by Index Cateogy")

ag.buddhists <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Buddhists")]) %>% as.data.frame

ggplot(ag.buddhists, aes(x=factor(Category), y=`Buddhists`)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Buddhists by Index Cateogy")

ag.jews <- aggregate(. ~ Category, sum, data=d.count[,c("Category","Jews")]) %>% as.data.frame

ggplot(ag.jews, aes(x=factor(Category), y=`Jews`)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Jews by Index Cateogy")

# ===============================================
library(reshape2)


startCol <- which(colnames(dr) == "Christians")
endCol <- which(colnames(dr) == "Jews")

d.countlong <- melt(
  d.count, 
  id.vars = c(1:10),
  measure.vars = startCol:endCol,
  variable.name = "religion",
  value.name = "count"
) # convert to long format


d.full <- aggregate(. ~ religion, sum, data=d.countlong[d.countlong$Category=="Full democracy",c("religion","count")]) %>% as.data.frame

ggplot(d.full, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Full Democracy")

d.flawed <- aggregate(. ~ religion, sum, data=d.countlong[d.countlong$Category=="Flawed democracy",c("religion","count")]) %>% as.data.frame

ggplot(d.flawed, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Flawed Democracy")

d.hybrid <- aggregate(. ~ religion, sum, data=d.countlong[d.countlong$Category=="Hybrid regime",c("religion","count")]) %>% as.data.frame

ggplot(d.hybrid, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Hybrid Regime")

d.authoritarian <- aggregate(. ~ religion, sum, data=d.countlong[d.countlong$Category=="Authoritarian",c("religion","count")]) %>% as.data.frame

ggplot(d.authoritarian, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Authoritarian")

# =============

plot(d.wide$Score,d.wide$entropy)


