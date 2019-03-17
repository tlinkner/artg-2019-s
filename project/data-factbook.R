library(tidyverse)
library(jsonlite)


json_files <- list.files(pattern ="*.json", recursive = TRUE) %>% as.vector
c_filenames <- str_detect(json_files,pattern = "[a-z][a-z]\\.json")
c_files <- json_files[c_filenames]


# holder df
c_data <- data.frame()


# for (file in c_files) {
#   c  <- read_json('data/factbook.json-master/africa/ag.json', simplifyVector = TRUE)
#   # short country name
#   c_name <- c$Government$`Country name`$`conventional short form` %>% as.character
#   # religions
#   c_religions <- c$`People and Society`$Religions %>% as.character
#   # internet two-letter country code
#   c_letter <- str_sub(c$Communications$`Internet country code`,2,3) %>% as.character
#   # numeric country code
#   c_code <- str_match(c$Communications$`Telephone system`$international,"[0-9][0-9][0-9]") %>% as.character
#   c_row <- data.frame(c_name, c_letter, c_code, c_religions)
#   c_data <- bind_rows(list(c_data,c_row))
# }



dataset <- do.call("rbind", lapply(c_files, FUN = function(file) {
  c  <- read_json(file, simplifyVector = TRUE)
  # short country name
  c_name <- c$Government$`Country name`$`conventional short form` %>% as.character
  # # # religions
  c_religions <- c$`People and Society`$Religions
  # # # internet two-letter country code
  c_letter <- str_sub(c$Communications$`Internet country code`,2,3) %>% as.character
  # # # numeric country code
  c_code <- str_match(c$Communications$`Telephone system`$international,"[0-9][0-9][0-9]") %>% as.character
  # c_row <- data.frame(c_name, c_religions)
  # # c_row
  # print(paste(file,c_name,c_religions, sep="//"))
  if (length(c_name) == 0) {
    c_name <- NA
  }
  if (length(c_religions) == 0) {
    c_religions <- NA
  }
  if (length(c_letter) == 0) {
    c_letter <- NA
  }
  if (length(c_code) == 0) {
    c_code <- NA
  }
  print(paste(file, length(c_name), length(c_religions), length(c_letter), length(c_code)))
  c_row <- data.frame(c_name, c_religions)
  c_row
}))









# %>%
#   lapply(function(x) read_xlsx(x, col_names = c.names, col_types = c.types, trim_ws=TRUE)) %>%
#   rbind.fill



c  <- read_json('data/factbook.json-master/antarctica/ay.json', simplifyVector = TRUE)

cc <- c$`People and Society`$Religions %>% as.character

length(cc)

cc

# 
# # short country name
# c_name <- c$Government$`Country name`$`conventional short form` %>% as.character
# # religions
c_religions <- c$`People and Society`$Religions %>% as.character
# # internet two-letter country code
# c_letter <- str_sub(c$Communications$`Internet country code`,2,3) %>% as.character
# # numeric country code
# c_code <- str_match(c$Communications$`Telephone system`$international,"[0-9][0-9][0-9]") %>% as.character
# 
# c_row <- data.frame(c_name, c_letter, c_code, c_religions)


