var Hapi 	= require('hapi');
var Bell 	= require('bell');
var Cookie 	= require('hapi-auth-cookie');
var Path 	= require('path');
var routes 	= require('./routes/routes.js');
var config 	= require('./config.js');
var port     = {port: (process.env.port || 3000 ), host: 'localhost' }; //TODO set host as 0.0.0.0 for heroku

var goodOptions = {
	opsInterval: 1000,
	reporters: [{
		reporter: require('good-console'),
		args:[{ log: '*', error: '*'}]
	}]
};

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
	if (err) console.error(err);

	// NB session strategy set to 'optional' mode. Therefor, unless overriden in handler auth will be attempted for each page
	// however, page will still be served, we need to discriminate between signed in /not signed in users and adjust response appropriately
	// for some pages (e.g. upload), stratgey should be set to true
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
		path: 		'./views',
		isCached: false
	});

	server.auth.default('session'); //TODO try removing default, putting optional in seesion strategy
	server.route( routes );
});

server.register({
	register: require('good'),
	options: goodOptions
}, function (err) {

	if (err) {
		console.error(err);
	}
	// else {
	//     server.start(function () {

	//         console.info('Server started at ' + server.info.uri);
	//     });
	// }
});

// server.on('response', function(err, res){
// 	if (err) console.error(err);
// 	else console.log(res);
// });

module.exports = server;




