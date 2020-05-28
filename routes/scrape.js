//Dependencies
const express = require('express'),
      router = express.Router(),
      db = require('../models');


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
	// First, we grab the body of the html with axios
	axios.get("https://www.bhg.com/gardening/houseplants/").then(function (response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);

		// Now, we grab every h2 within an article tag, and do the following:
		$(".category-page-item ").each(function (i, element) {
			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.title = $(this)
				.children(".category-page-item-content-wrapper")
				.children("a")
				.text()
				.trim();
			result.articleURL = $(this)
				.children(".category-page-item-content-wrapper")
				.children("a")
				.attr("href");
			result.imgURL = $(this)
				.children(".category-page-item-image")
				.children("a")
				.children("div")
				.attr("data-src");
			result.imgAltText = $(this)
				.children(".category-page-item-image")
				.children("a")
				.children("div")
				.attr("data-alt");

			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function (dbArticle) {
					// View the added result in the console
					console.log(dbArticle);
				})
				.catch(function (err) {
					// If an error occurred, log it
					console.log(err);
				});
		});

		// Send a message to the client
		res.send("Scrape Complete");
	});
});

module.exports = router;