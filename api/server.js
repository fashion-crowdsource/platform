var Hapi 	= require('hapi');
var Bell 	= require('bell');
var Cookie 	= require('hapi-auth-cookie');
var Path 	= require('path');
var routes 	= require('./routes/routes.js');
var config 	= require('./config.js');
var port 	= {port: (process.env.port || 3000 ) };

var server = new Hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: Path.join(__dirname, '../public')
			}
		}
	}
});

server.connection(port);

server.register([Bell, Cookie], function (err) {
	if (err) {throw err;}

	server.auth.strategy('session', 'cookie', {
		password: config.cookie.password,
		cookie: 'sid',
		redirectTo: '/',
		redirectOnTry: false,
		isSecure: false
	});

	server.auth.strategy('google', 'bell', {
		provider: 'google',
		password: config.google.secret,
		isSecure: false,
		// ttl: 20000, // 10s ttl for the cookies used by bell to manage the temp state - an attempt to fix the logout problem
		clientId: config.google.cKey,
		clientSecret: config.google.cSecret
	});


	server.views({
		engines: {
			jade: require("jade")
		},
		compileOptions: {
			pretty: true
		},
		relativeTo: __dirname,
		path: 		  "./views",
		isCached: false
	});

	// server.auth.default('session');
	server.route( routes );
});


module.exports = server;
