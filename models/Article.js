var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
	// `title` is required and of type String
	title: {
		type: String,
		required: true,
	},
	// `link` is required and of type String
	articleURL: {
		type: String,
		required: true,
	},
    // `photo` is required and of type String
	imgURL: {
		type: String,
		required: true,
    },
        // `photo` is required and of type String
	imgAltText: {
		type: String,
		required: true,
    },
    // `saved` is required and of type Boolean
    saved: {
        type: Boolean,
		default: false,
		required: true,
	},
	// `link` is required and of type String
	articleID: {
			type: String,
			required: true,
	},
	// `note` is an object that stores a Note id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note
	notes: {
		type: Schema.Types.Mixed,
		ref: "Note",
	},
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
