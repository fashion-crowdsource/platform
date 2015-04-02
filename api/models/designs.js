var mongoose 	= require("mongoose");
var schemae	= require("./schemae.js");
var Design = schemae.Design;

// GENERAL SEARCH FUNCTION - returns an ARRAY
// takes a query object, q:{} is required, f:{} is optional (a filter)
// e.g. {
// 			q: {username: 'foo'},
// 			f: {'email': 1, '_id':0}  <-- 1 to include a field, 0 to exclude. OPTIONAL
// 		}
function search(query, callback) {
	if (query.f) {
		Design.find(query.q, query.f, function(err, result){
			if (err) {
				return callback(err);
			}
			else {
				return callback(null, result);
			}
		});
	}
	else {
		Design.find(query.q, function(err, result){
			if (err) {
				return callback(err);
			}
			else {
				return callback(null, result);
			}
		});
	}
}

// mainImgPath required, imageArray and fileArray optional - pass as empty arrays
function createDesign(designData, mainImgPath, imageArray, fileArray, callback) {
	var newDesign = new Design(designData);

	newDesign.attach('mainImage', {path: mainImgPath}, function(err){
		if (err) {
			console.error(err);
			return callback(err);
		}
		else {
			if (imageArray.length > 0) {
				if (fileArray.length === 0) {
					imageArray.forEach(function(ele, ind){
						newDesign.attach('additionalImages', {path: ele}, function(err1){
							if (err1) {
								console.error(err1);
								return callback(err1);
							}
							else if (ind === imageArray.length - 1) {
								newDesign.save(function(err2, design){
									if (err) {
										return callback(err2);
									}
									else {
										return callback(null, design);
									}
								});
							}
						});
					});
				}
				else {
					imageArray.forEach(function(ele, ind){
						newDesign.attach('additionalImages', {path: ele}, function(err1){
							if (err1) {
								console.error(err1);
								return callback(err1);
							}
							else if (ind === imageArray.length - 1) {
								fileArray.forEach(function(ele, ind){
									newDesign.attach('additionalFiles', {path: ele}, function(err2){
										if (err2) {
											console.error(err2);
											return callback(err2);
										}
										else if (ind === fileArray.length - 1) {
											newDesign.save(function(err3, design){
												if (err) {
													return callback(err3);
												}
												else {
													return callback(null, design);
												}
											});
										}
									});
								});
							}
						});
					});
				}
			}
			else {
				newDesign.save(function(err1, design){
					if (err) {
						return callback(err1);
					}
					else {
						return callback(null, design);
					}
				});
			}
		}
	});
}

function getDesignById(designId, callback) {
	Design.findOne({_id: designId}, function(err, design){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, design);
		}
	});
}


function getAllDesigns(callback) {
	Design.find({}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, designs);
		}
	});
}

function updateDesignById(designId, callback) {
	Design.findOneAndUpdate({_id: designId}, function(err, design){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, design);
		}
	});
}

function deleteDesignById(designId, callback) {
	Design.findOneAndRemove({_id: designId}, function(err, design){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, design);
		}
	});
}

// functions below will return ARRAYS
function getDesignsByDesignerUserName(designerUserName, callback) {
	Design.find({designerUserName: designerUserName}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, design);
		}
	});
}

function deleteDesignsByDesignerUserName(designId, callback) {
	Design.remove({designerUserName: designerUserName}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, designs);
		}
	});
}

function testAddDesign(designData, imagePath ,callback) {
	var newDesign = new Design(designData);

	newDesign.attach('image', {path: imagePath}, function(error) {
		if (error) console.log('attach error:', error);
		else {
			newDesign.save(function(err, design){
				if (err) {
					return callback(err);
				}
				else {
					return callback(null, design);
				}
			});
		}
	});
}


module.exports = {
	search: search,
	createDesign: createDesign,
	getDesignById: getDesignById,
	getAllDesigns: getAllDesigns,
	updateDesignById: updateDesignById,
	deleteDesignById: deleteDesignById,
	getDesignsByDesignerUserName: getDesignsByDesignerUserName,
	deleteDesignsByDesignerUserName: deleteDesignsByDesignerUserName,
	testAddDesign: testAddDesign
};
