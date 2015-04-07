var users = require('./users');

var mongoose 	= require("mongoose");
var config 		= require("../config").db;

var mongodbUri 	= "mongodb://" + config.dbuser + ":" + config.dbpwd + "@" + config.dburl;






mongoose.connect(mongodbUri, function() {
	var db = mongoose.connection;

	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function() {
		users.deleteUser('Adam Kowalczyk', function(err, user){
			console.log('DELETE ADAM KOWALCZYK');
			if (err) console.error(err);
			else if (user) console.log(user);
		});
	});
});
