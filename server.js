var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, 
    //{ useNewUrlParser: true }
    );

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.bhg.com/gardening/houseplants/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".category-page-item ").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children(".category-page-item-content-wrapper")
          .children("a")
          .text()
          .trim(); 
        result.link = $(this)
          .children(".category-page-item-content-wrapper")
          .children("a")
          .attr("href");
        result.photo = $(this)
          .children(".category-page-item-image")
          .children("a")
          .children("div")
          .attr("data-src");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  app.get("/delete", function(req, res) {
    db.Article.remove({}, function(err) { 
        console.log('collection removed') 
     });
})  

  // Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });