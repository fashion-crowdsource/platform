var config 	 	= require('../config.js').s3;
var mongoose 	= require('mongoose');
var crate 		= require('mongoose-crate');
var S3 			= require('mongoose-crate-s3');
var ImageMagick = require('mongoose-crate-imagemagick');
var Schema 		= mongoose.Schema;
var ObjectId 	= mongoose.Schema.Types.ObjectId;


var designSchema = new Schema({
	designerUserName: 	{type: String, required: true, unique: true},
	designerId: 		{type: ObjectId, required: true, unique: true},
	name: 				{type: String, required: true},
	description: 		{type: String, required: true},
	dateAdded: 			{type: Date, required: true}
});

designSchema.plugin(crate, {
	storage: new S3({
		key: config.key,
		secret: config.secret,
		bucket: config.bucket,
		acl: config.acl,
		region: config.region,
	}),
	fields: {
		designMainImage: {
			processor: new ImageMagick({
				// tmpDir: '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
				// formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
				transforms: {
					original: {
						// keep the original file
					},
					small: {
						resize: '200x200',
						format: '.jpg'
					},
					medium: {
						resize: '300x300',
						format: '.jpg'
					},
					large: {
						resize: '500x500',
						format: '.jpg'
					},
					extraLarge: {
						resize: '1000x1000',
						format: '.jpg'
					}
				}
			})
		},
		designAdditionalImages: {
			array: true,
			processor: new ImageMagick({
				// tmpDir: '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
				// formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
				transforms: {
					original: {
						// keep the original file
					},
					small: {
						resize: '200x200',
						format: '.jpg'
					},
					medium: {
						resize: '300x300',
						format: '.jpg'
					},
					large: {
						resize: '500x500',
						format: '.jpg'
					},
					extraLarge: {
						resize: '1000x1000',
						format: '.jpg'
					}
				}
			})
		}
	}
});


var userSchema = new Schema({
	username: 		{type: String, required: true, unique: true},
	email: 			{type: String, required: true, unique: true},
	firstName: 		{type: String, required: true},
	surname: 		{type: String, required: true},
	phoneNumber: 	{type: String}, //optional --NB. must make sure phone/address kept private, admin use only
	address: 		{type: String}, //optional
	bio: 			{type: String}, //optional
	links: 			[String], 		//optional
	dateJoined: 	{type: Date, required: true},
	isAdmin: 		{type: Boolean, required: true, default: false},
	// isDesigner	{type: Boolean, required: true, default: false}, //if taking user signups, e.g. to preorder
	designIds: 		[ObjectId]
});


userSchema.plugin(crate, {
	storage: new S3({
		key: config.key,
		secret: config.secret,
		bucket: config.bucket,
		acl: config.acl,
		region: config.region,
	}),
	fields: {
		profileImage: {
			processor: new ImageMagick({
				// tmpDir: '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
				// formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
				transforms: {
					original: {
						// keep the original file
					},
					small: {
						resize: '200x200',
						format: '.jpg'
					},
					medium: {
						resize: '300x300',
						format: '.jpg'
					},
					large: {
						resize: '500x500',
						format: '.jpg'
					}
				}
			})
		},
		additionalFiles: {
			array: true
		}
	}
});

var User 	= mongoose.model('user', userSchema, 'users');
var Design 	= mongoose.model('design', designSchema, 'designs');

module.exports= {
	User: User,
	Design: Design
};
