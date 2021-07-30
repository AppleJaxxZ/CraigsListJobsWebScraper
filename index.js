const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Listing = require("./model/Listing");
require("dotenv").config();

async function scrapeListings(page) {
  //targets which page to open in chromium
  await page.goto(
    "https://allentown.craigslist.org/d/software-qa-dba-etc/search/sof"
  );
  //copies all html content
  const html = await page.content();
  //loads all of the html content
  const $ = cheerio.load(html);

  //Both of these element selectors could be used individually.
  //   $(".result-title").each((index, element) => console.log($(element).text()));
  //   $(".result-title").each((index, element) =>
  //     console.log($(element).attr("href"))
  //   );

  //using map enables us to put the data together in object arrays.
  //result-info is our parent element that contains the title, and other elements needed.
  const results = $(".result-info")
    .map((index, element) => {
      // we used titleElement with result-title here to find the child element that contains the other info.
      const titleElement = $(element).find(".result-title");
      //were again finding the result-date element inside our result info parent element.
      const timeElement = $(element).find(".result-date");
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      //we also want the date posted inside the timeElement that has the attribute "datetime"
      const datePosted = new Date($(timeElement).attr("datetime"));
      // And again with the location.  You Find the element inside our parent class, then get the text of that class.
      const nearbyElement = $(element).find(".nearby");
      const nearBy = $(nearbyElement)
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");

      return { title, url, datePosted, nearBy };
    })
    .get();
  return results;
}

const db = process.env.DB;

async function connectToMongoDb() {
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to mongoDB");
}

async function scrapeJobDescriptions(listings, page) {
  for (var i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);
    const jobDescription = $("#postingbody").text().trim();
    const compensation = $(
      "body > section > section > section > div.mapAndAttrs > p > span:nth-child(1)"
    ).text();
    listings[i].compensation = compensation;
    listings[i].jobDescription = jobDescription;
    console.log(listings[i].jobDescription);
    console.log(listings[i].compensation);
    const ListingModel = new Listing(listings[i]);
    await ListingModel.save();
    await sleep(1000); // 1 second sleep
  }
}

async function sleep(miliseconds) {
  return new Promise((reslove) => setTimeout(reslove, miliseconds));
}

//the main function is used so we can reuse it with other functions
async function main() {
  await connectToMongoDb();
  //Headless : boolean toggles chromium opening or not
  const browser = await puppeteer.launch({ headless: false });
  //opens the new page in the browser
  const page = await browser.newPage();

  const listings = await scrapeListings(page);

  const listingsWithJobDescriptions = await scrapeJobDescriptions(
    listings,
    page
  );
  console.log(listings);
}

main();
