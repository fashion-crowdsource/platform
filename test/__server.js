var lab     = exports.lab = require('lab').script();
var assert  = require('chai').assert;
var Hapi    = require('hapi');
var server  = require('../api/server.js');


//homeview
lab.experiment("When the user visits the homepage: ", function(){

    lab.test("It should GET designs gallery", function(done){

        var options = {
            url: '/',
            method: 'GET'
        };

        server.inject(options, function(response){

            assert.equal(response.statusCode, 200, "should return a status code of 200");
            assert.include(response.headers["content-type"], "image/png" || "image/jpg", "the images should load");
			done();
        });

    });

});

//logging in
lab.experiment("When the user tries to login: ", function(){

	lab.test("if not authenticated,", function(done){

		var options = {
			method: 'GET',
			url: '/login'
		};

		server.inject(options, function(response){

			assert.equal(response.statusCode, 302, "should return a Found status code of 302");
			done();
		});
	});

	lab.test("if authenticated ", function(done){
		var options = {
			url: "/login",
			method: "GET",
			credentials : {
				username 	: "neats",
		 		email 		: "xx@xx.co.uk",
		 		picture 	: "to get url"
			}
		};
		server.inject(options, function(response){
			assert.equal(response.statusCode, 302, "should return a Found status code of 302");
			assert.ok(response.headers["set-cookie"], "session should be set");
			done();
		});
	});

});

//upload page
lab.experiment("on the upload page: ", function(){

	lab.test("if not authenticatd", function(done){

		var options = {
			method: 'GET',
			url: '/{username}/upload'
		};

		server.inject(options, function(response){
			assert.equal(response.statusCode, 302, "they should get a found (redirection) 302 status code");
			assert.include(response.headers.location, "/login", "they should be redirected to the login page, cross your fingers!");
			done();
		});
	});

	lab.test("if authenticated (GET)", function(done){

		var options = {
				url: "/{username}/upload",
				method: "GET",
				credentials : {
					username 	: "neats",
					email 		: "xx@xx.co.uk",
					picture 	: "to get url"
				}
			};

		server.inject(options, function(response){
			assert.equal(response.statusCode, 302, "they should get a found (redirection) 302 status code");
			assert.include(response.headers["content-type"], "text/html", "they should get a html upload page");
			done();
		});
	});

	lab.test("if authenticated (POST)", function(done){

		var options = {
				url: "/{username}/upload",
				method: "POST",
				credentials : {
					username 	: "neats",
					email 		: "xx@xx.co.uk",
					picture 	: "to get url"
				}
			};

		server.inject(options, function(response){
			assert.equal
		});

	});
});





