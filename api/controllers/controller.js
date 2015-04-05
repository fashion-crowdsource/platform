var Bell 	= require("bell");
var Path 	= require("path");
var Joi 	= require("joi");
var config 	= require('../config');
var users 	= require('../models/users');
var designs = require('../models/designs');

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
				console.dir(gPlus,{depth:null});
				var profile = {
					username 	: gPlus.profile.displayName,
					email 		: gPlus.profile.email,
					picture 	: gPlus.profile.raw.picture,
					hasAccount	: false,
					isAdmin		: false
				};

				// NB. We are assuming user.username will be set to profile.username
				 users.getUser(profile.username, function(err, user){
					if (err) console.log(err);

					if (user) profile.hasAccount = true;
					if (user) {
						if (user.isAdmin) profile.isAdmin = true;
					}

					request.auth.session.clear();
					request.auth.session.set(profile);

					return profile.hasAccount ? reply.redirect('/') : reply.redirect('/signup');
				 });
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
		auth: false, //to prevent redirect loop from session cookie
		handler: function (request, reply ){
			return reply.view('index');
		}
	},

	signupView: {
		auth: {mode: 'required'},
		handler: function (request, reply ){
			// return request.auth.credentials.hasAccount ? reply.redirect('/profile/'+request.auth.credentials.username) : reply.view('signup');
			return reply.view('signup');
		}
	},

	signupSubmit: {
		auth: {mode: 'required'},
		// validate:{
		// 	payload: <joiObjectName>,
		// },
		payload : {
			maxBytes: 5242880, //5MB User feedback on hitting the limit required. Prevent attachment of too large an image, submit attempt should never fail.
			output: 'file',
			parse: true
		},
		handler: function (request, reply ){
			console.dir(request.auth.credentials);
			console.log('Payload:');
			console.dir(request.payload);
			var user = request.payload;
			var newUserObj = {
				username: request.auth.credentials.username,
				email: user.email,
				firstName: user.firstname,
				lastName: user.lastname,
				dateJoined: new Date()
			};
			// Construct address as string
			newUserObj.address = '';
			newUserObj.address += user.addressFirstLine + '\n';
			if(user.addressSecondLine) newUserObj.address += user.addressSecondLine + '\n';
			newUserObj.address += user.addressTown + '\n';
			if(user.addressCounty) newUserObj.address += user.addressCounty + '\n';
			newUserObj.address += user.addressPostcode;

			if (user.phonenumber) newUserObj.phoneNumber = user.phoneNumber;
			if (user.bio) newUserObj.bio = user.bio;
			// TODO links. ??? -> array
			var profileImgPath = null;
			if (user.profileImage) profileImgPath = user.profileImage.path;
			if (user.admin === 'Yes') newUserObj.isAdmin = true; //!!!! REMOVE IN PRODUCTION

			// ADD NEW USER TO DB
			users.createUser(newUserObj, profileImgPath, function(err, user){
				if (err) {
					console.error(err);
					reply.view('signup', {error: err}); //TODO use error in template. User needs to know signup failed
				}
				else {
					// !!! CANT EDIT request.auth.creds - doesnt save
					// request.auth.credentials.hasAccount = true;
					// if (user.isAdmin) request.auth.credentials.isAdmin = true; //!!!! REMOVE IN PRODUCTION
					request.auth.session.set('hasAccount', true);
					if (user.isAdmin) request.auth.session.set('isAdmin', true); //!!!! REMOVE IN PRODUCTION
					console.dir(request.auth.credentials);
					reply.redirect('/profile/'+user.username);
				}
			});
		}
	},

	profileView: {
		handler: function (request, reply ){
			var userName = request.params.username;
			users.getUser(userName, function(err, user){
				if (err) {
					console.error(err);
					return reply.redirect('/'); //TODO pass failure info to user e.g.'server error'. How? if can't pass context data to redirect, try adding query string to url, and parse
				}
				else if (user) {
					return reply.view('profile', {user: user});
				}
				else {
					return reply.redirect('/'); //TODO pass failure info to user e.g.'user not found'. How? if can't pass context data to redirect, try adding query string to url, and parse !!OR!! put in cookie
					// Could simply reply with home view, butshould be redirect as not requested resource.
				}
			});
		}
	},

	editUser: {
		auth: {mode: 'required'},
		handler: function (request, reply ){

			var editor = request.params.username;
			var updatedField = request.payload;

			users.updateUser(editor, updatedField, function(err, result){
				if (err) {
					return reply(err);
				}
				if (updatedField.bio) {
					//think this is almost there but not quite sure how to make the result bit work
					return reply.redirect("profile");
				}
			});
			// UPDATE USER DB ENTRY
			// RETURN VIEW OF UPDATED PROFILE
			//return reply.view('profile');
		}
	},

	deleteUser: {
		auth: {mode: 'required'},
		handler: function (request, reply ){
			// DELETE USER DB ENTRY
			// REDIRECT TO LOGOUT? better/more common to be taken back to the homeview(gallery)
			return reply.redirect('/');
		}
	},

	uploadView: {
		handler: function (request, reply ){
			console.log(request.auth.credentials);
			return request.auth.credentials.hasAccount ? reply.view('upload') : reply.redirect('signup');
		}
	},

	// function createDesign(designData, mainImgPath, imageArray, fileArray, callback)
	uploadNewDesign: {
		auth: {mode: 'required'},
		// validate:{
		// 	payload: <joiObjectName>,
		// },
		payload : {
			maxBytes: 209715200, //20MB? May need to be greater, and user feedback on hitting the limit required. Prevent attachment of too large a collection of images, submit attempt should never fail.
			output: 'data',
			parse: true
		},
		handler: function (request, reply ){
			console.dir(request.payload);
			// ADD NEW SUBMISSION TO DB
			// 1. get user doc from db
			var userName = request.auth.credentials.username;
			users.getUser(userName, function(err, user){
				if (err) {
					console.error(err);
					return reply.redirect('/'); //TODO: error handling. redirect? or same view with error?
				}
				// 2. save payload data to new design doc
				else if (user) {
					var design = request.payload;
					var newDesignObj = {
						designerUserName: userName,
						designerId: user._id,
						name: design.name,
						description: design.description,
						dateAdded: new Date()
					};
					if (design.additionalInfo) newDesignObj.additionalInfo = design.additionalInfo;
					var mainImgPath = request.payload.files.mainImage.path;
					var imageArray = [];
					var fileArray = [];
					// TODO collect addImages and files from payload and put paths in array
					designs.createDesign(newDesignObj, mainImgPath, imageArray, fileArray, function(err1, design){
						if (err1) {
							console.error(err1);
							return reply.redirect('/'); //TODO <--
						}
						// 3. save design doc ObjId to user designs[]
						else {
							console.log('design saved');
							console.dir(design);
							var designId = design._id;
							user.designIds.push(designId);
							user.save(function(err2, savedUser){
								if (err2) {
									console.error(err2);
									// TODO delete design if saving designId fails??? Maybe add a scheduled task that searches designs by username, checks if indexed in user
									return reply.redirect('/'); // <--- TODO
								}
								else {
									console.dir(savedUser);
									return reply.view('profile', {user: savedUser.username});
								}
							});
						}
					});
				}
				else {
					return reply.redirect('/'); //TODO <- user not found response. should never happen...
				}
			});

			return reply.redirect('profile/'+request.auth.credentials.username);
		}
	},

	designView: {
		handler: function (request, reply ){
			return reply.view('design');
		}
	},

	preorderDesign: {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// ADD UPVOTE/PREORDER TO DB
			// redirect to design view with upvote/preorder registered
			return reply.redirect('designs/{username}/{design}');
		}
	},

	adminView: {
				// check auth for isAdmin - add it on login
		handler: function (request, reply ){
			// REQUIRE AUTH!
			return reply.view('admin');
		}
	},

	adminDesignView:  {
		// check auth for isAdmin - add it on login
		handler: function (request, reply ){
			// REQUIRE AUTH!
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
