var fs = require('fs');

// A function to clean up the payload temp files.
// TODO: Refactor to get paths directly from payload

// make sure to put the paths of files to cleanup in an ARRAY before passing in
function cleanUp(pathsArray) {
	pathsArray.forEach(function(ele){
		fs.unlink(ele, function(err){
			if (err) console.error(err);
		});
	});
}

module.exports = {
	cleanUp: cleanUp
};
