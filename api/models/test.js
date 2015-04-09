var mongoose 	= require("mongoose");
var config 		= require("../config").db;

var mongodbUri 	= "mongodb://" + config.dbuser + ":" + config.dbpwd + "@" + config.dburl;

var users = require('./users');
var designs = require('./designs');

var ObjectId = mongoose.Types.ObjectId();

// var id = new ObjectId('5523c1a656f343b0bbd24e35');




mongoose.connect(mongodbUri, function() {
	var db = mongoose.connection;

	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function() {
		// designs.getDesignById('552424eb943920870bffc81d', function (err, design){
		// 	if (err) {
		// 		console.error(err);
		// 	}
		// 	else {
		// 		console.dir(design);
		// 	}
		// });
		designs.deleteDesignById('552424eb943920870bffc81d', function (err, design){
			if (err) {
				console.error(err);
			}
			else {
				console.log('design deleted');
			}
		});
		// designs.getAllDesigns(function(err, users){
		// 	if (err) {
		// 		console.error(err);
		// 	}
		// 	else {
		// 		users.forEach(function(ele){console.log(ele._id);});
		// 	}
		// });
		// users.deleteUser("amil v", function(err, user){
		// 	if (err) {
		// 		console.error(err);
		// 	}
		// 	else {
		// 		console.log('User Deleted');
		// 	}
		// });
	});
});
