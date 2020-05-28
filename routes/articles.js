//Dependencies
const express = require("express"),
	router = express.Router(),
	db = require("../models");

router.get("/viewSaved", (req, res) => {
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

router.put("/save/:id", function (req, res) {
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

router.put("/remove/:id", function (req, res) {
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

module.exports = router;
