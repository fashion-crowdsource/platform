var Bell 	 = require("bell");
var Path 	 = require("path");
var Joi 	 = require("joi");
var config 	 = require('../config.js');


module.exports = {

	serveFile: {
		auth: false,
		handler: {
			directory: {
				path: '../public'
			}
		}
	},

	login : {
		// auth: {
		// 	strategy: "github"
		// },
		// handler: function (request, reply) {
		// 	if (request.auth.isAuthenticated) {

		// 		var g = request.auth.credentials;
		// 		var profile ={
		// 			username 	: g.profile.username,
		// 			email 		: g.profile.email,
		// 			avatar 		: g.profile.raw.avatar_url,
		// 			url 		: g.profile.raw.url,
		// 			account 	: false
		// 		};

		// 		 accounts.getAccount( profile.username, function( err, result ){
		// 			if (err) console.log(err);
		// 			if (result) profile.account = true;

		// 			request.auth.session.clear();
		// 			request.auth.session.set(profile);

		// 			return profile.account ? reply.redirect("/account") : reply.redirect("/signup");
		// 		 });
		// 	}
		// 	else reply('Not logged in, should be forwarded to bell login...').code(401);
		// }
	},

	logout: {
		handler: function (request, reply ){
			request.auth.session.clear();
			return reply.redirect('/');
		}
	},

	homeView: {
		handler: function (request, reply ){
			return reply.view('index.jade');
		}
	},

	profileView: {
		handler: function (request, reply ){
			return reply.view('profile.jade');
		}
	},

	editUser: {
		handler: function (request, reply ){
			// UPDATE USER DB ENTRY
			// RETURN VIEW OF UPDATED PROFILE
			return reply.view('profile.jade');
		}
	},

	deleteUser: {
		handler: function (request, reply ){
			// DELETE USER DB ENTRY
			// REDIRECT TO LOGOUT?
			return reply.redirect('/logout');
		}
	},

	uploadView: {
		handler: function (request, reply ){
			return reply.view('upload.jade');
		}
	},

	uploadNewDesign: {
		handler: function (request, reply ){
			// ADD NEW SUBMISSION TO DB (NOT YET SUBMITTED)
			return reply.redirect('/{username}/submit');
		}
	},

	submitView: {
		handler: function (request, reply ){
			return reply.view('submit.jade');
		}
	},

	submitDesign: {
		handler: function (request, reply ){
			// COMPLETE ADDING DESIGN TO DB
			return reply.redirect('/{username}');
		}
	},

	editDesign: {
		handler: function (request, reply ){
			// EDIT SUBMISSION IN PROGRESS
			// redirect to submission, in new state
			return reply.redirect('/{username}/submit');
		}
	},

	binDesigns: {
		handler: function (request, reply ){
			// REMOVE ALL TRACE OF DESIGN FROM DB
			return reply.redirect('/{username}');
		}
	},

	designView: {
		handler: function (request, reply ){
			return reply.view('design.jade');
		}
	},

	upVoteDesign: {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// ADD UPVOTE/PREORDER TO DB
			// redirect to design view with upvote/preorder registered
			return reply.redirect('/{username}/{design}');
		}
	},

	adminDesignView:  {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// ADD UPVOTE/PREORDER T
			return reply.view('admin.jade');
		}
	},

	ApproveDesign:  {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// approve new design for gallery display -toggle a bool in the db?
			return reply.redirect('admin.jade');
		}
	},

	adminBinDesign:  {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// reject a design. purge all db refs to it.
			return reply.redirect('admin.jade');
		}
	},

};
