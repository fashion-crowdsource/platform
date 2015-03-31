var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// store images in S3, links here
var imageSchema =  new Schema({
	title: {type: String, required: true},
	url: {type: String, required: true}
});

var designSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	images: [imageSchema]
});

var userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	surname: {type: String, required: true},
	phoneNumber: {type: String, required: true},
	address: {type: String}, //optional
	bio: {type: String}, //optional
	dateJoined: {type: Date, required: true},
	isAdmin: {type: Boolean, required: true, default: false},
	designs: [designSchema]
});

var User 	= mongoose.model('user', userSchema, 'Users');
var Design 	= mongoose.model('design', designSchema);
var Image 	= mongoose.model('image', imageSchema);

module.exports= {
	User: User,
	Design: Design,
	Image: Image
};
