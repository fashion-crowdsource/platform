var users = require('./users');
var designs = require('./designs');

var mongoose 	= require('mongoose');
var config 		= require('../config').db;

var mongodbUri 	= 'mongodb://' + config.dbuser + ':' + config.dbpwd + '@' + config.dburl;


// Testing the mongoose-crate-s3 middleware hooks for s3 image deletion. Seems to work!



mongoose.connect(mongodbUri, function() {
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function() {

		designs.deleteDesignsByDesignerUserName('Adam Kowalczyk', function(err, design){
			console.log('DELETE ADAM KOWALCZYK DESIGNS');
			if (err) console.error(err);
			else if (design) console.log(design);
		});

		users.deleteUser('Adam Kowalczyk', function(err, user){
			console.log('DELETE ADAM KOWALCZYK');
			if (err) console.error(err);
			else if (user) console.log(user);
		});
	});
});
