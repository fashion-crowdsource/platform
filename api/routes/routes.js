var controller = require('../controllers/controller.js');

module.exports = [
	{path: "/{file*}",					method: "GET",		config: controller.serveFile},

	{path: '/', 						method: 'GET', 		config: controller.homeView},
	{path: '/signup', 					method: 'GET', 		config: controller.signupView},
	{path: '/signup', 					method: 'POST', 	config: controller.signupSubmit},
	{path: '/login', 					method: 'POST', 	config: controller.login},
	{path: '/logout', 					method: 'GET', 		config: controller.logout},

	{path: '/profile/{username}', 		method: 'GET', 		config: controller.profileView},
	{path: '/profile/{username}', 		method: 'PUT', 		config: controller.editUser},
	{path: '/profile/{username}', 		method: 'DELETE', 	config: controller.deleteUser},

	{path: '/{username}/upload', 		method: 'GET', 		config: controller.uploadView},
	{path: '/{username}/upload', 		method: 'POST', 	config: controller.uploadNewDesign},

	{path: '/{username}/submit',		method: 'GET', 		config: controller.submitView},
	{path: '/{username}/submit', 		method: 'POST', 	config: controller.submitDesign},
	{path: '/{username}/submit',		method: 'PUT', 		config: controller.editDesign},
	{path: '/{username}/submit', 		method: 'DELETE', 	config: controller.binDesign},

	{path: '/designs/{username}/{design}', 	method: 'GET', 		config: controller.designView},
	{path: '/designs/{username}/{design}', 	method: 'POST', 	config: controller.upVoteDesign},
	//{path: '/{username}/{design}', 		method: 'PUT', 		config: controller.editSubmittedDesign},
	//{path: '/{username}/{design}', 		method: 'DELETE', 	config: controller.binSubmittedDesign},

	{path: '/admin/{username}/{design}', method: 'GET', 	config: controller.adminDesignView},
	{path: '/admin/{username}/{design}', method: 'POST', 	config: controller.adminApproveDesign},
	{path: '/admin/{username}/{design}', method: 'DELETE', 	config: controller.adminBinDesign},
];
