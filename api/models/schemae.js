var config 	 	= require('../config.js').s3;
var mongoose 	= require('mongoose');
var crate 		= require('mongoose-crate');
var S3 			= require('mongoose-crate-s3');
var ImageMagick = require('mongoose-crate-imagemagick');
var Schema 		= mongoose.Schema;
var ObjectId 	= mongoose.Schema.Types.ObjectId;


var designSchema = new Schema({
	designerUserName: 	{type: String, required: true},
	designerId: 		{type: ObjectId, required: true},
	name: 				{type: String, required: true},
	description: 		{type: String, required: true},
	additionalInfo: 	{type: String},
	dateAdded: 			{type: Date, required: true}
});

designSchema.plugin(crate, {
	storage: new S3({
		key: 	config.key,
		secret: config.secret,
		bucket: config.bucket,
		acl: 	config.acl,
		region: config.region,
	}),
	fields: {
		mainImage: {
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
		additionalImages: {
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
		},
		additionalFiles: {
			array: true
		}
	}
});


var userSchema = new Schema({
	username: 		{type: String, required: true, unique: true},
	email: 			{type: String, required: true, unique: true},
	firstName: 		{type: String, required: true},
	lastName: 		{type: String, required: true},
	phoneNumber: 	{type: String}, //optional --NB. must make sure phone/address kept private, admin use only
	bio: 			{type: String}, //optional
	links: 			[String], 		//optional
	dateJoined: 	{type: Date, required: true},
	isAdmin: 		{type: Boolean, required: true, default: false},
	// isDesigner	{type: Boolean, required: true, default: false}, //if taking user signups, e.g. to preorder
	designIds: 		[ObjectId],
	address: 		{
						firstLine: {type: String},
						secondLine: {type: String},
						town: {type: String},
						county: {type: String},
						postcode: {type: String},
						full: {type: String}
	} //optional?? currently required on form and in controller code
});


userSchema.plugin(crate, {
	storage: new S3({
		key: 	config.key,
		secret: config.secret,
		bucket: config.bucket,
		acl: 	config.acl,
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
		}
	}
});

var User 	= mongoose.model('user', userSchema, 'users');
var Design 	= mongoose.model('design', designSchema, 'designs');

module.exports= {
	User: User,
	Design: Design
};
