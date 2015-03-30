var lab     = exports.lab = require('lab').script();
var assert  = require('chai').assert;
var Hapi    = require('hapi');
var server  = require('../api/server.js');


//homepage '/'
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
			
			assert.equal(response.statusCode, 302, "should return a FOUND status code of 302");
			done();
		})
	})
	
})







