var Hapi 	= require('hapi');
var Bell 	= require('bell');
var Cookie 	= require('hapi-auth-cookie');
var Path 	= require('path');
var routes 	= require('./routes/routes.js');
var config 	= require('./config.js');

var serverOptions 	= {port: (process.env.port || 3000 ), host: 'localhost' }; //TODO set host as 0.0.0.0 for heroku - put in config, make conditional on process.env.PORT

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

server.connection(serverOptions);

server.register([Bell, Cookie], function (err) {
	if (err) console.error(err);

	server.auth.strategy('session', 'cookie',{
		password: config.cookie.password,
		cookie: 'sid',
		// redirectTo: '/', // <- better not to use auto redirect? A lot of our pages are visible to un-authed users.
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
		path: 	'./views',
		isCached: false
	});

	server.auth.default('session'); //TODO try removing default, putting optional in session strategy
	server.route(routes);
});

server.register({
	register: require('good'),
	options: goodOptions
}, function (err) { if (err) console.error(err); });

module.exports = server;




