var mongoose 	= require("mongoose");
var schemae	= require("./schemae.js");
var User = schemae.User;

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

function createUser(userData, callback) {
	var newUser = new User(userData);
	newUser.save(function(err, user){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, user);
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

function getAllUsers(userName, callback) {
	User.find({}, function(err, users){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, users);
		}
	});
}

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
	User.findOneAndRemove({username: userName}, function(err, user){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, user);
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
