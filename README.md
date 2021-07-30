# CraigsListJobsWebScraper
node and cheerio webscraper that scrapes job listings from various pages and save them into a mongoDB using ["cheerio", "puppeteer", "mongoose", "node"]


First FORK the project, then clone it if you'd like to save it to your own git repo.

1.) Clone Project
2.) in commandline/bash/powershell cd into root folder
3.) type in npm install
4.) If you dont already have a mongoDB account, create one, create a new Project.
5.) Under database click connect.  copy the connect string below, paste it in the .envsample file after DB=
6.) rename your .envsample file to .env (delete the sample part)  then save.
7. Back in your command line of choice type node index.js
8.) Chromium will pop-up and start scraping the craigslist link full of listings I chose. 
10.) (OPTIONAL) you can replace it with your own job listings link under the 
"scrapeListings" function.  " await page.goto(
    "https://allentown.craigslist.org/d/software-qa-dba-etc/search/sof"
  );"
  11.) If you dont wish to watch the chromium browser pop-up and scrape, just change  const browser = await puppeteer.launch({ headless: false }); to headless: true.
  This is located in the main() function.  
  12.) Enjoy the scraping!
  
  
  
