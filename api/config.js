/* $lab:coverage:off$ */
module.exports = {
	db : {
				dbuser : process.env.DBUSER 	|| require('./creds.json').database.dbuser,
				dbpwd  : process.env.DBPWD 		|| require('./creds.json').database.dbpwd,
				dburl  : process.env.DBURL 		|| require('./creds.json').database.dburl,
	},
	google : {
				secret 	: process.env.SECRET 	|| require('./creds.json').github.secret,
				cKey	: process.env.CKEY 		|| require('./creds.json').github.cKey,
				cSecret	: process.env.CSECRET 	|| require('./creds.json').github.cSecret,
	},
	cookie : {
				password: process.env.COOKIESECRET || require('./creds.json').cookieSecret
	}
};
/* $lab:coverage:on$ */
