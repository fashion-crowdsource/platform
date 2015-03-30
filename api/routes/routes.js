var controller = require('../controllers/controller.js');

module.exports = [
    
    {path: '/', method: 'GET', config: controller.home},
    {path: '/login', method: 'POST', config: controller.login},
    
    {path: '/{username}', method: 'GET', config: controller.getUsername},
    {path: '/{username}', method: 'PUT', config: controller.putUsername},
    {path: '/{username}', method: 'DELETE', config: controller.deleteUsername},
    
    {path: '/{username}/upload', method: 'GET', config: controller.seeUploadPage},
    {path: '/{username}/upload', method: 'POST', config: controller.upload},
    
    {path: '/{username}/submit', method: 'GET', config: controller.viewBeforeSubmit},
    {path: '/{username}/submit', method: 'POST', config: controller.SubmitDesign},
    {path: '/{username}/submit', method: 'PUT', config: controller.editDesign},
    {path: '/{username}/submit', method: 'DELETE', config: controller.binDesign},
    
    {path: '/{username}/{design}', method: 'GET', config: controller.viewDesign},
    {path: '/{username}/{design}', method: 'POST', config: controller.upVoteDesign},
    //{path: '/{username}/{design}', method: 'PUT', config: controller.editSubmittedDesign},
    //{path: '/{username}/{design}', method: 'DELETE', config: controller.binSubmittedDesign},
    
    {path: '/admin/{username}/{design}', method: 'GET', config: controller.adminViewDesign},
    {path: '/admin/{username}/{design}', method: 'POST', config: controller.adminApproveDesign},
    {path: '/admin/{username}/{design}', method: 'DELETE', config: controller.adminBinDesign}
     
];
    
    
    
    
    
    
