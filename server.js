var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

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

//setting up handlebars

const hbs = exphbs.create({
	defaultLayout: "main",
	//custom helpers
	helpers:{
		hash: function(string) {
			return "#" + string.toString();
		}
	} 
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true });

// Routes

app.get("/", (req, res) => {
	db.Article.find({})
		.lean()
		.then(function (dbArticle) {
			// If we were able to successfully find Articles, send them back to the client
			let hbsObject = {
				articles: dbArticle,
			};
			res.render("index", hbsObject);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
});

app.get("/viewsaved", (req, res) => {
	db.Article.find({})
		.lean()
		.then(function (dbArticle) {
			// If we were able to successfully find Articles, send them back to the client
			let hbsObject = {
				articles: dbArticle,
			};
			res.render("saved", hbsObject);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
});

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
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
			result.articleID = $(this)
				.children(".category-page-item-image")
				.children("a")
				.children("div")
				.attr("data-title");

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

app.get("/delete", function (req, res) {
	db.Article.deleteMany({}, function (err) {
		console.log("collection removed");
	});
});

app.put("/save/:id", function (req, res) {
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
		.then(function (data) {
			// If we were able to successfully find Articles, send them back to the client
			res.json(data);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
});

app.put("/remove/:id", function (req, res) {
	db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
		.then(function (data) {
			// If we were able to successfully find Articles, send them back to the client
			res.json(data);
		})
		.catch(function (err) {
			// If an error occurred, send it to the client
			res.json(err);
		});
});

// Start the server
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});
