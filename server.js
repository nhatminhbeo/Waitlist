var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

// THIS IS A TEST COMMENT
// THIS IS A SECOND COMMENT

// Create the database
var PouchDB = require('pouchdb');
var db = new PouchDB('workshop');

var app = express();


// =========================
// App Configs
// =========================
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.disable('x-powered-by');

// Allowing CORS
app.use(function(req,res,next) {
	res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.append('Access-Control-Allow-Credentials', 'true');
	res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
	res.append('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.enable('trust proxy');


// =======================================================================
// RESTful Routes
// HTTP Verbs: GET, POST, PUT, DELETE
//
// Name     	|   Path      		|   HTTP Verb |   Purpose
// =======================================================================
// Index    	|   /:id      		|   GET       | Show the waitlist
// Sign in  	|   /signin/   		|   GET       | Show form to signin
// Edit     	|   /edit/:id 		|   GET       | Show form to edit a specific user
// Get list 	|   /waitlist/ 		|   GET       | Get the userlist as json
// Delete list 	|   /waitlist/:id 	|   DELETE	  | Delete an user with id from waitlist
// Get user 	|	/user/:id 		| 	GET 	  | Get an user with id as json
// Edit user 	| 	/user/:id 		| 	PUT 	  | Edit an user with id as json
// =======================================================================


// ====================
//   waitlist resource
// ====================
app.get('/waitlist/', function(req, res) {
	db.allDocs({
		
	})
})

// get(routes, callbacks)
app.get('/posts/', function(req, res) {

	db.allDocs({
		include_docs: true,
		attachments: true

	}, function(err, result) {
		if (err) {
			res.sendStatus(400);
		} else {
			res.status(200).json(result);
		}
	});
});

app.post('/posts/', function(req, res) {
	var post = {
		title: req.body.title,
		post: req.body.post
	};

	db.post(post, function(err, created) {
		if (err) {
			res.sendStatus(400);
		} else {
			res.status(201).json(created);
		}

	});
});

app.delete('/posts/:id', function(req, res) {

	db.get(req.params.id, function(err, found) {
		if (err) {
			res.sendStatus(400); 
		} else {
			db.remove(found, function(err, removed) {
				if (err) {
					res.sendStatus(400);
				} else {
					res.sendStatus(202);
				}
			});
		}
	});


});

app.get('/app', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


app.listen(3000, function() {
	console.log('Server running');
});