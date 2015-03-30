var mongoose 	= require("mongoose");
var server 		= require('./api/server');
// var config 		= require("./api/config").mongo;

// var mongodbUri 	= "mongodb://" + config.dbuser + ":" + config.dbpwd + "@" + config.dburl;

server.start(function () {

	// mongoose.connect(mongodbUri, function() {
	// 	var db = mongoose.connection;

	// 	db.on("error", console.error.bind(console, "connection error"));
	// 	db.once("open", function() {
	// 		console.log("database connection successful");
	// 	});
	// });

	console.log('Server running at:', server.info.uri);
});