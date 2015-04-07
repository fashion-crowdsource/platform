var fs 			= require('fs');
var mongoose 	= require("mongoose");
var schemae		= require("./schemae.js");
var User 		= schemae.User;

// GENERAL SEARCH FUNCTION - returns an ARRAY
// takes a query object, q:{} is required, f:{} is optional (a filter)
// e.g. {
// 			q: {username: 'foo'},
// 			f: {'email': 1, '_id':0}  <-- 1 to include a field, 0 to exclude. OPTIONAL
// 		}
function search(query, callback) {
	if (query.f) {
		User.find(query.q, query.f, function(err, result){
			if (err) {
				return callback(err);
			}
			else {
				return callback(null, result);
			}
		});
	}
	else {
		User.find(query.q, function(err, result){
			if (err) {
				return callback(err);
			}
			else {
				return callback(null, result);
			}
		});
	}
}

// function createUser(userData, imagePath, callback) {
// 	var newUser = new User(userData);
// 	if (imagePath) {
// 		newUser.attach('profileImage', {path: imagePath}, function(err){
// 			if (err) {
// 				console.error(err);
// 				return callback(err);
// 			}
// 			else{
// 				newUser.save(function(err1, user){
// 					if (err1) {
// 						return callback(err1);
// 					}
// 					else {
// 						return callback(null, user);
// 					}
// 				});
// 			}
// 		});
// 	}
// 	else {
// 		newUser.save(function(err1, user){
// 			if (err1) {
// 				return callback(err1);
// 			}
// 			else {
// 				return callback(null, user);
// 			}
// 		});
// 	}
// }

function createUser(userData, imagePath, callback) {
	var newUserObj = new User(userData);

	User.create(newUserObj, function(err0, newUser){
		if (err0) {
			console.error(err0);
			return callback(err0);
		}
		else {
			if (imagePath) {
				newUser.attach('profileImage', {path: imagePath}, function(err){
					if (err) {
						console.error(err);
						return callback(err);
					}
					else{
						newUser.save(function(err1){
							if (err1) {
								return callback(err1);
							}
							else {
								return callback(null, newUser);
							}
						});
					}
				});
			}
			else {
				newUser.save(function(err1){
					if (err1) {
						return callback(err1);
					}
					else {
						return callback(null, newUser);
					}
				});
			}
		}
	});
}





function getUser(userName, callback) {
	User.findOne({username: userName}, function(err, user){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, user);
		}
	});
}

function getAllUsers(callback) {
	User.find({}, function(err, users){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, users);
		}
	});
}

// TODO Refactor update to allow middleware to excecute for s3 edit. Use findOne, then save doc.
function updateUser(userName, callback) {
	User.findOneAndUpdate({username: userName}, function(err, user){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, user);
		}
	});
}

function deleteUser(userName, callback) {
	User.findOne({username: userName}, function(err, user){
		if (err) {
			return callback(err);
		}
		else if (user) {
			user.remove(function(err1){
				if (err1) {
					return callback(err1);
				}
				else {
					return callback(null, user);
				}
			});
		}
	});
}


module.exports = {
	search: search,
	createUser: createUser,
	getUser: getUser,
	getAllUsers: getAllUsers,
	updateUser: updateUser,
	deleteUser: deleteUser
};
