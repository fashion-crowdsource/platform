var mongoose 	= require('mongoose');
var schemae	= require('./schemae.js');
var Design = schemae.Design;
var users = require('./users.js');

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

// TODO: Fix error handling in forEach loops -  can currently result in multiple reply calls
// mainImgPath required, imageArray and fileArray optional - pass as empty arrays
function createDesign(designData, mainImagePath, imageArray, fileArray, callback) {
	var newDesignObj = new Design(designData);

	Design.create(newDesignObj, function(err0, newDesign){
		if (err0) {
			return callback(err0);
		}
		else {
			newDesign.attach('mainImage', {path: mainImagePath}, function(err){
				if (err) {
					console.error(err);
					return callback(err);
				}
				else {
					if (imageArray.length > 0 && fileArray.length > 0) {
						imageArray.forEach(function(ele, ind){
							newDesign.attach('additionalImages', {path: ele}, function(err1){
								if (err1) {
									console.error(err1);
									// return callback(err1); // <-Can invoke multiple replies!
								}
								else if (ind === imageArray.length - 1) {
									fileArray.forEach(function(ele, ind){
										newDesign.attach('additionalFiles', {path: ele}, function(err2){
											if (err2) {
												console.error(err2);
												// return callback(err2);
											}
											else if (ind === fileArray.length - 1) {
												newDesign.markModified('additionalImages');
												newDesign.markModified('additionalFiles');
												newDesign.save(function(err3){
													if (err) {
														return callback(err3);
													}
													else {
														return callback(null, newDesign);
													}
												});
											}
										});
									});
								}
							});
						});
					}
					else if (imageArray.length > 0 && fileArray.length === 0) {
						imageArray.forEach(function(ele, ind){
							newDesign.attach('additionalImages', {path: ele}, function(err1){
								if (err1) {
									console.error(err1);
									// return callback(err1);
								}
								else if (ind === imageArray.length - 1) {
									newDesign.markModified('additionalImages');
									newDesign.save(function(err2){
										if (err) {
											return callback(err2);
										}
										else {
											return callback(null, newDesign);
										}
									});
								}
							});
						});
					}
					else if (imageArray.length === 0 && fileArray.length > 0) {
						fileArray.forEach(function(ele, ind){
							newDesign.attach('additionalFiles', {path: ele}, function(err1){
								if (err1) {
									console.error(err1);
									return callback(err1);
								}
								else if (ind === fileArray.length - 1) {
									newDesign.markModified('additionalFiles');
									newDesign.save(function(err2){
										if (err) {
											return callback(err2);
										}
										else {
											return callback(null, newDesign);
										}
									});
								}
							});
						});
					}
					else {
						newDesign.save(function(err1){
							if (err) {
								return callback(err1);
							}
							else {
								return callback(null, newDesign);
							}
						});
					}
				}
			});
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

function getAllApprovedDesigns(callback) {
	Design.find({approved: true}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, designs);
		}
	});
}

function getAllPendingDesigns(callback) {
	Design.find({approved: false}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, designs);
		}
	});
}

// TODO finish! Need to edit design and SAVE to invoke middleware. ?? for var prop in newDesignObject, design[prop] = newDesignObject[prop], design.save()
function updateDesignById(designId, newDesignObject , callback) {
	Design.findOne({_id: designId}, function(err, design){
		if (err) {
			return callback(err);
		}
		else {
			return callback(null, design);
		}
	});
}

// TODO - also delete obId from designers designs array
// TODO? Call remove directly, still exectues middleware?
function deleteDesignById(designId, callback) {
	Design.findOne({_id: designId}, function(err, design){
		if (err) {
			return callback(err);
		}
		else {
			design.remove(function(err1) {
				if (err1) {
					return callback(err1);
				}
				else {
					return callback(null, design);
				}
			});
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
			return callback(null, designs);
		}
	});
}

// TODO Empty designer's design array
function deleteDesignsByDesignerUserName(designerUserName, callback) {
	Design.find({designerUserName: designerUserName}, function(err, designs){
		if (err) {
			return callback(err);
		}
		else {
			if (designs) {
				designs.forEach(function(design, ind){
					design.remove(function(err1){
						if (err1) {
							console.error(err1); //<- how to handle error?
						}
						else if (ind === designs.length - 1) {
							return callback(null, designs);
						}
					});
				});
			}
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
	getAllApprovedDesigns: getAllApprovedDesigns,
	getAllPendingDesigns: getAllPendingDesigns,
	updateDesignById: updateDesignById,
	deleteDesignById: deleteDesignById,
	getDesignsByDesignerUserName: getDesignsByDesignerUserName,
	deleteDesignsByDesignerUserName: deleteDesignsByDesignerUserName,
	testAddDesign: testAddDesign
};
