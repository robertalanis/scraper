
//Dependencies
const express = require('express'),
      router = express.Router(),
      db = require("../models");

router.get("/", (req, res) => {
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

router.get("/delete", function (req, res) {
	db.Article.remove({}, function (err) {
		console.log("collection removed");
	});
});

module.exports = router;