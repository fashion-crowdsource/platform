var Bell 	= require('bell');
var Path 	= require('path');
var Joi 	= require('joi');
var mongoose = require('mongoose');
var config 	= require('../config');
var users 	= require('../models/users');
var designs = require('../models/designs');
var trash 	= require('../models/trash');


// TODO! add success meesages to submit etc. action responses


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
			strategy: 'google'
		 },
		 handler: function (request, reply) {
			if (request.auth.isAuthenticated) {

				var gPlus = request.auth.credentials;
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
		auth: {mode: 'optional'},
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;
			designs.getAllApprovedDesigns(function(err, designs){
				if (err) {
					return reply.view('index', {error: err, auth: auth});
				}
				else if (designs) {
					return reply.view('index', {designs: designs, auth: auth});
				}
				else {
					return reply.view('index', {error: 'No designs found', auth: auth});
				}
			});
		}
	},

	signupView: {
		auth: {mode: 'optional'},
		handler: function (request, reply ){
			// return reply.view('signup');
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;
			if (auth) {
				return request.auth.credentials.hasAccount ? reply.redirect('/profile/'+request.auth.credentials.username) : reply.view('signup', {auth: auth});
			}
			else {
				return reply.redirect('/');
			}
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
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			console.log('Payload:');
			console.dir(request.payload);
			var user = request.payload;
			var newUserObj = {
				username: request.auth.credentials.username,
				email: user.email,
				firstName: user.firstname,
				lastName: user.lastname,
				dateJoined: new Date(),
				address: {
					firstLine: user.addressFirstLine,
					town: user.addressTown,
					postcode: user.addressPostcode,
					full: ''
				}
			};
			// construct full address, and check for optional fields
			newUserObj.address.full += user.addressFirstLine + '\n';
			if(user.addressSecondLine) {
				newUserObj.address.full += user.addressSecondLine + '\n';
				newUserObj.address.secondLine = user.addressSecondLine;
			}
			newUserObj.address.full += user.addressTown + '\n';
			if(user.addressCounty) {
				newUserObj.address.full += user.addressCounty + '\n';
				newUserObj.address.county = user.addressCounty;
			}
			newUserObj.address.full += user.addressPostcode;

			if (user.phonenumber) newUserObj.phoneNumber = user.phonenumber;
			if (user.bio) newUserObj.bio = user.bio;
			// TODO links. ??? -> array
			var profileImagePath = null;
			if (user.profileImage) profileImagePath = user.profileImage.path;
			if (user.admin === 'Yes') newUserObj.isAdmin = true; //!!!! REMOVE IN PRODUCTION

			var tempFiles = [profileImagePath];
			// ADD NEW USER TO DB
			users.createUser(newUserObj, profileImagePath, function(err, user){
				if (err) {
					console.error(err);
					if (profileImagePath) trash.cleanUp(tempFiles);
					reply.view('signup', {error: err, auth: auth});
				}
				else {
					request.auth.session.set('hasAccount', true);
					if (user.isAdmin) request.auth.session.set('isAdmin', true); //!!!! REMOVE IN PRODUCTION
					if (profileImagePath) trash.cleanUp(tempFiles);
					reply.redirect('/profile/'+user.username);
				}
			});
		}
	},

	designersView: {
		auth: {mode: 'optional'},
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			users.getAllUsers(function(err, users){
				if (err) {
					return reply.view('designers', {error: err, auth: auth});
				}
				else {
					return reply.view('designers', {designers: users, auth: auth});
				}
			});
		}
	},
// TODO pass {auth: {username: request.auth.credentials.username}} to all views if auth
	profileView: {
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			var userName = request.params.username;
			users.getUser(userName, function(err, user){
				if (err) {
					console.error(err);
					return reply.view('profile', {error: err});
				}
				else if (user) {
					if (user.designIds.length > 0) {
						designs.getDesignsByDesignerUserName(userName, function(err1, designs){
							if (err1) {
								return reply.view('profile', {user: user, auth: auth, error: err1});
							}
							else {
								return reply.view('profile', {designs: designs, user: user, auth: auth});
							}
						});
					}
					else {
						return reply.view('profile', {user: user, auth: auth});
					}
				}
				else {
					return reply.view('profile', {error: 'User not found'});
				}
			});
		}
	},

	// We could change the route to simply 'profile', or 'profile/edit' <- GET is the edit profile view, PUT and DEL are the edit/del operations
	editUser: {
		auth: {mode: 'required'},
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			var editor = request.auth.credentials.username;
			var updatedUser = request.payload;

			users.updateUser(editor, updatedUser, function(err, result){
				if (err) {
					return reply.view('profile', {error: err, auth: auth});
				}
				if (result) {
					return reply.view('profile', {user: result, auth: auth});
				}
			});
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
		auth: {mode: 'required'},
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;
			return request.auth.credentials.hasAccount ? reply.view('upload', {auth:auth}) : reply.redirect('signup');
		}
	},

	uploadNewDesign: {
		auth: {mode: 'required'},
		// validate:{
		// 	payload: <joiObjectName>,
		// },
		payload : {
			maxBytes: 209715200, //20MB? May need to be greater, and user feedback on hitting the limit required. Prevent attachment of too large a collection of images, submit attempt should never fail.
			output: 'file',
			parse: true
		},
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;
			console.dir(request.payload);
			// ADD NEW SUBMISSION TO DB
			// 1. get user doc from db
			var userName = request.auth.credentials.username;
			users.getUser(userName, function(err, user){
				if (err) {
					console.error(err);
					return reply.view('upload', {error: err, auth: auth});
				}
				// 2. save payload data to new design doc
				else if (user) {
					var design = request.payload;
					var newDesignObj = {
						designerUserName: request.auth.credentials.username,
						designerId: user._id,
						name: design.designName,
						description: design.description,
						dateAdded: new Date()
					};
					if (design.additionalInfo) newDesignObj.additionalInfo = design.additionalInfo;
					var mainImagePath = design.designMainImage.path;

					var imagePathArray = [];
					var filePathArray = [];
					var tempFiles = [mainImagePath];

					for (var prop in design) {
						if (/additionalImage/.test(prop) ) {
							tempFiles.push(design[prop].path);
							if (/additionalImage/.test(prop) && design[prop].filename.length > 0 ) {
								imagePathArray.push(design[prop].path);
							}
						}
						else if (/additionalFile/.test(prop) ) {
							tempFiles.push(design[prop].path);
							if (/additionalFile/.test(prop) && design[prop].filename.length > 0 ) {
								filePathArray.push(design[prop].path);
							}
						}
					}

					designs.createDesign(newDesignObj, mainImagePath, imagePathArray, filePathArray, function(err1, design){
						if (err1) {
							console.error(err1);
							trash.cleanUp(tempFiles);
							return reply.view('upload', {error: err1, auth: auth});
						}
						// 3. save design doc ObjId to user designs[]
						else {
							// console.dir(design);
							trash.cleanUp(tempFiles);
							var designId = design._id;
							user.designIds.push(designId);
							user.save(function(err2){
								if (err2) {
									console.error(err2);
									// TODO??? Maybe add a scheduled task that searches designs by username, checks if indexed in user
									return reply.view('upload', {error: err2, auth: auth});
								}
								else {
									return reply.view('upload', {success: 'Design Succesfully Submited', auth: auth});
								}
							});
						}
					});
				}
				else {
					return reply.redirect('/'); //TODO <- user not found response. should never happen...
				}
			});
		}
	},
	// TODO make sure vistor cant view an unapproved design. Check for approved bool in template
	designView: {
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			var designId = request.params.design;
			designs.getDesignById(designId, function(err, design){
				if (err) {
					return reply.view('design', {error: err, auth: auth});
				}
				else if (design) {
					return reply.view('design', {design: design, auth: auth});
				}
				else {
					return reply.view('design', {error: 'Design not found', auth: auth});
				}
			});
		}
	},

	preorderDesign: {
		handler: function (request, reply ){
			// REQUIRE AUTH!
			// ADD UPVOTE/PREORDER TO DB
			// redirect to design view with upvote/preorder registered
			return reply.redirect('/{design}');
		}
	},


	adminView:  {
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			designs.getAllPendingDesigns(function(err, designs){
			  if (err) {
				return (request.auth.isAuthenticated && request.auth.credentials.isAdmin) ? reply.view('admin', {error: err, auth: auth}) : reply.redirect('/');
			  }
			  else if (designs) {
			   return (request.auth.isAuthenticated && request.auth.credentials.isAdmin) ? reply.view('admin', {designs: designs, auth: auth}) : reply.redirect('/');
			  }
			   else {
				 return (request.auth.isAuthenticated && request.auth.credentials.isAdmin) ? reply.view('admin', {error: 'No pending designs found', auth: auth}) : reply.redirect('/');
			   }
		  });
		}
	},

	adminApproveDesign:  {
		handler: function (request, reply ){
			var auth = false;
			if (request.auth.isAuthenticated) auth = {username: request.auth.credentials.username };
			if (request.auth.isAuthenticated && request.auth.credentials.isAdmin) auth.admin = true;

			if (request.auth.credentials.isAdmin) {
				var designId = request.params.design;
				console.log('Approving Design' + designId );
				designs.getDesignById(designId, function(err, design){
					if (err) {
						return reply.view('admin', {error:err, auth: auth});
					}
					else if (design) {
						var designerUserName = design.designerUserName;
						users.getUser(designerUserName, function(err1, user){
							if (err1) {
								return reply.view('admin', {error:err1, auth: auth});
							}
							else {
								design.approved = true;
								design.save(function(err2) {
									if (err2) {
										return reply.view('admin', {error:err2, auth: auth});
									}
									else {
										// TODO prevent multiples of the same ObjectId in approvd array
										user.approvedDesignIds.push(design._id);
										user.save(function(err3){
											if (err3) {
												return reply.view('admin', {error:err2, auth: auth});
											}
											else {
												console.log('Succesfully Approved');
												return reply.view('admin', {sucess: 'Design Succesfully Approved', auth: auth});
											}
										});
									}
								});
							}
						});
					}
					else {
						return reply.view('admin', {error: 'Design not found', auth: auth});
					}
				});
			}
			// NB - this is to prevent hax...
			else {
				reply.redirect('/');
			}
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
