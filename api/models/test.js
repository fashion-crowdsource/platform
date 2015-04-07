var designs = require('./designs');
var Path = require('path');
var id = mongoose.Types.ObjectId();

var mongoose 	= require("mongoose");
var config 		= require("../config").db;

var mongodbUri 	= "mongodb://" + config.dbuser + ":" + config.dbpwd + "@" + config.dburl;


var designData = {
	designerUserName: 	'DesignerMcDesignerson',
	designerId: 		id,
	name: 				'Hat',
	description: 		'A most majestic design',
	dateAdded: 			new Date()
};

var imgPath = Path.join(__dirname, 'fikay-girl.png');





mongoose.connect(mongodbUri, function() {
	var db = mongoose.connection;

	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function() {
		designs.testAddDesign(designData, imgPath, function(err, design){
			if (err) {
				console.log(err);
			}
			else {
				console.log(design);
			}
		});
	});
});
