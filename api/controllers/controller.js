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

	login: {
		 auth: {
			strategy: "google"
		 },
		 handler: function (request, reply) {
			if (request.auth.isAuthenticated) {

				var gPlus = request.auth.credentials;
				var profile = {
					username 	: gPlus.profile.displayName,
					email 		: gPlus.profile.email,
					picture 	: gPlus.profile.raw.picture,
					hasAccount	: false
				};

				// DO NOT DELETE
		// 		 CHECK DB FOR USER( profile.username, function( err, result ){
		// 			if (err) console.log(err);
		// 			if (result) profile.hasAccount = true;

					request.auth.session.clear();
					request.auth.session.set(profile);

					return profile.hasAccount ? reply.redirect('/') : reply.redirect('/signup');
		// 		 });
			}
			else {
				return reply.redirect('/');
			}

		}
	},

	logout: {
		handler: function (request, reply ){
			request.auth.session.clear();
			return reply.redirect('/');
		}
	},

	homeView: {
		handler: function (request, reply ){
			return reply.view('index');
		}
	},

	signupView: {
		// AUTH REQUIRED - also, add redirect if user in db, to prevent direct access
		handler: function (request, reply ){
			return reply.view('signup');
		}
	},

	signupSubmit: {
		// AUTH REQUIRED ?
		handler: function (request, reply ){
			// ADD NEW USER TO DB
			return reply.redirect('/');
		}
	},

	profileView: {
		handler: function (request, reply ){
			if (request.auth.isAuthenticated) {
				var username = request.auth.credentials.username;
				//get username from db
				//get profile description from db
				//get designs from db
				return reply.view('profile');
			} else {
				return reply.redirect("/login");
			}
		}
	},

	editUser: {
		handler: function (request, reply ){
			// UPDATE USER DB ENTRY
			// RETURN VIEW OF UPDATED PROFILE
			return reply.view('profile');
		}
	},

	deleteUser: {
		handler: function (request, reply ){
			// DELETE USER DB ENTRY
			// REDIRECT TO LOGOUT? better/more common to be taken back to the homeview(gallery)
			return reply.redirect('/');
		}
	},

	uploadView: {
		handler: function (request, reply ){
			return reply.view('upload');
		}
	},

	uploadNewDesign: {
		payload : {
			maxBytes: 209715200,
			output: 'stream',
			parse: false
		},
		handler: function (request, reply ){

			// ADD NEW SUBMISSION TO DB (NOT YET SUBMITTED)
			return reply.redirect('/{username}/submit');
		}
	},

	submitView: {
		handler: function (request, reply ){
			return reply.view('submit');
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

	binDesign: {
		handler: function (request, reply ){
			// REMOVE ALL TRACE OF DESIGN FROM DB
			return reply.redirect('/{username}');
		}
	},

	designView: {
		handler: function (request, reply ){
			return reply.view('design');
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
			// ADD UPVOTE/PREORDER TO DB
			return reply.view('admin');
		}
	},

	adminApproveDesign:  {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// approve new design for gallery display -toggle a bool in the db?
			return reply.redirect('admin');
		}
	},

	adminBinDesign:  {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// reject a design. purge all db refs to it.
			return reply.redirect('admin');
		}
	}
};
