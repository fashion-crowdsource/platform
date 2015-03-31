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

	// server.auth.strategy('session', 'cookie', {
	// 	password: config.cookie.password,
	// 	cookie: 'sid',
	// 	redirectTo: '/',
	// 	redirectOnTry: false,
	// 	isSecure: false
	// });

	// server.auth.strategy('github', 'bell', {
	// 	provider: 'github',
	// 	password: config.github.secret,
	// 	isSecure: false,
	// 	ttl: 20000, // 10s ttl for the cookies used by bell to manage the temp state - an attempt to fix the logout problem
	// 	clientId: config.github.cKey,
	// 	clientSecret: config.github.cSecret
	// });

	// server.auth.strategy('twitter', 'bell', {
 //        provider: 'twitter',
 //        password: config.twitter.secret,
 //        isSecure: false,
 //        clientId: config.twitter.cKey,
 //        clientSecret: config.twitter.cSecret
 //    });

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
