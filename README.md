
#[Crowd Sourced Fashion Platform](http://rocky-sierra-8226.herokuapp.com/)

Currently live on [heroku](http://rocky-sierra-8226.herokuapp.com/)

## Connecting designers and makers

### Description

An MVP of a crowd-sourcing platform to connect fashion designers and manufacturers. 

Designers will submit designs for administrator review and, if accepted, the designs they will be made live on the site for visitors to view, share and pre-order.

In a fully realised product, visitor sharing behaviour would be tracked to provide information about the customer base. Pre-orders could be placed, and once enough pre-orders where received, the given garment would be produced and shipped.

In order to avoid storing large images in a mongodb instance, an S3 bucket is used to store uploaded image files and only the URLs are stored in mongodb. So as to avoid fetching unnecessarily large images for page views, the images are automatically resized (and squared) by imagemagick on upload into a selection of useful sizes.

Built using Node.js and Hapi, with mongodb and amazon S3.

### Team

[Adam Kowalczyk](https://github.com/adamkowalczyk)

[Anita Amini](https://github.com/Neats29)

[Amil Vasishtha](https://github.com/amilvasishtha)

[Olu Niyi-Awosusi](https://github.com/oluoluoxenfree)


### Installation

* Clone repo: `git clone [repo url]`
* `npm install`
* `touch api/creds.json` see `api/creds.json.example` for structure
* Install [imagemagick](http://www.imagemagick.org/script/binary-releases.php)
* Run: `npm start`
* Test: `npm test` 


### Service dependencies

1. [Amazon S3](http://aws.amazon.com/s3/)
2. Mongodb e.g. [mongolab](https://mongolab.com/)
3. [Google oauth](https://console.developers.google.com/)

Keys to be stored in api/creds.json or as process.env variables, e.g. on Heroku.
See api/config.js for environment variable names.

*NB* Ensure that an appropriate redirect URI is set for Google oauth

### User flow

There are three different kinds of user.

1. Visitor
2. Designer
3. Administrator

A 'designer' or 'administrator' must log in using google, but a normal visitor to the site does not need to log in.

#### Visitor

The visitor:
* sees a gallery of headline images, linking to designs
* can click on an image to view a the design in detail
* can view a gallery of designer profile images, linking to designer profiles
* can click on a profile image to view a designers profile, including links to their approved designs

The visitor will be able to share and pre-order designs.

#### Designer

A designer sees the same site as an unauthenticated visitor.

On first log in, a designer will be asked to provide their personal details on a 'sign up' page.

In addition, the designer:
* can view their own profile directly via a navbar link
* can view an 'upload' page via a navbar link
* can upload a design with a description and up to 6 images for public view, as well as up to 2 additional files for administrator view.

#### Administrator

An administrator sees the same site as a designer.

In addition, the administrator:
* can view a gallery of designs waiting for approval
* can visit a designers profile and see both their approved and unapproved designs
* can view any unapproved design, and click a button reject or accept it. A rejected design is deleted, an accepted design immediately goes live and will be viewable by visitors.

### Screenshots

![Main Page](/screenshots/homeView.jpg?raw=true 'Main Page')
![Designer Profile](/screenshots/profileView.jpg?raw=true 'Designer Profile')
![Design Page](/screenshots/designView.jpg?raw=true 'Design Page')
![Admin Page](/screenshots/adminView.jpg?raw=true 'Admin Page')
![Accept/Reject](/screenshots/acceptView.jpg?raw=true 'Accept/Reject')
