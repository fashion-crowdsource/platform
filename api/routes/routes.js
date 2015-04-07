var controller = require('../controllers/controller.js');

module.exports = [
	{path: "/{file*}",					method: "GET",		config: controller.serveFile},

	{path: '/', 						method: 'GET', 		config: controller.homeView},
	{path: '/signup', 					method: 'GET', 		config: controller.signupView},
	{path: '/signup', 					method: 'POST', 	config: controller.signupSubmit},
	{path: '/login', 					method: 'GET', 		config: controller.login},
	{path: '/logout', 					method: 'GET', 		config: controller.logout},

	{path: '/profile/{username}', 		method: 'GET', 		config: controller.profileView},
	{path: '/profile/{username}', 		method: 'PUT', 		config: controller.editUser},
	{path: '/profile/{username}', 		method: 'DELETE', 	config: controller.deleteUser},

	{path: '/upload', 					method: 'GET', 		config: controller.uploadView},
	{path: '/upload', 					method: 'POST', 	config: controller.uploadNewDesign},

	{path: '/{design}', 				method: 'GET', 		config: controller.designView},
	{path: '/{design}', 				method: 'POST', 	config: controller.preorderDesign},
	//{path: '/{design}', 				method: 'PUT', 		config: controller.editSubmittedDesign},
	//{path: '/{design}', 				method: 'DELETE', 	config: controller.binSubmittedDesign},

	{path: '/admin', 					method: 'GET', 		config: controller.adminView},
	{path: '/admin/{design}', 			method: 'GET', 		config: controller.adminDesignView},
	{path: '/admin/{design}', 			method: 'POST', 	config: controller.adminApproveDesign},
	{path: '/admin/{design}', 			method: 'DELETE', 	config: controller.adminBinDesign},
];
