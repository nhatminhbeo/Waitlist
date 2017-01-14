var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

// THIS IS A TEST COMMENT
// THIS IS A SECOND COMMENT

// Create the database
var PouchDB = require('pouchdb');
var dbwaitlist = new PouchDB('waitlist');
var dbuser = new PouchDB('user');

var tmplist = {
listid: 0,
userlist: []
};

// initialize first restaurant waitlist (for prototype)
dbwaitlist.allDocs({
		include_docs: true,
		attachments: true

	}, function(err, result) {
		if (err) {
			res.sendStatus(400);
		} else if (result.rows.length === 0) {
			console.log("Successfully initialized dbwaitlist");
			dbwaitlist.post(tmplist, function(err, created) {
				if (err) {
					console.log("Failed to initialize dbwaitlist");
				} 
			});		
		}
});


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
// Index    	|   /app/:id      	|   GET       | Show the waitlist
// Sign in  	|   /signin/   		|   GET       | Show form to signin
// Edit     	|   /edit/:id 		|   GET       | Show form to edit a specific user
// Get list 	|   /waitlist/ 		|   GET       | Get the userlist as json
// Update list 	|   /waitlist/ 		|   POST      | Create new user
// Delete list 	|   /waitlist/	 	|   DELETE	  | Delete an user with id from waitlist
// Get user 	|	/user/:id 		| 	GET 	  | Get an user with id as json
// Edit user 	| 	/user/  		| 	PUT 	  | Edit an user with id as json
// =======================================================================

// ====================
//   front end
// ====================
app.get('/signin/', function(req, res) {
	res.sendFile(__dirname + '/public/signin.html');
});

app.get('/app/:id', function(req, res) {
	res.sendFile(__dirname + '/public/index.html', {'id': req.params.id});
});

app.get('/edit/:id', function(req, res) {
	res.sendFile(__dirname + '/public/edit.html', {'id': req.params.id});
});


// ====================
//   waitlist resource
// ====================
app.get('/waitlist/', function(req, res) {


	// build flat list based on waitlist, then response the list
	dbwaitlist.allDocs({
		include_docs: true,
		attachments: true
	}, function(err, result) {
		var data = [];
		var j = 0
		if (err) {
			res.sendStatus(400);
		} else {
			
			//res.status(200).json(result);
			//return;
			for (var i=0; i<result.rows[0].doc.userlist.length; i++) {
				dbuser.get(result.rows[0].doc.userlist[i], function(err, found) {
					// console.log(found);
					if (err) {
						res.sendStatus(400);
					} else {
						data.push(found);
						j++;
						if (j === result.rows[0].doc.userlist.length) {
							console.log(i);
							res.status(200).json(data);
							return;
						}
					//data2 = JSON.stringify(data);
				}
				
				});
			}
			
		}
	});
});

app.post('/waitlist/', function(req, res) {

	// get data from request
	var post = {
		name: req.body.name,
		phone: req.body.phone,
		guests: req.body.guests,
		preferences: req.body.preferences
	};


	// create new user
	dbuser.post(post, function(err, created) {
		if (err) {
			console.log("failed to create user");
			res.sendStatus(400);
		} else {
				// enqueue
				dbwaitlist.allDocs({
					include_docs: true,
					attachments: true
				}, function(err, result) {
					if (err) {
						res.sendStatus(400);
					} else {
						var doc = result.rows[0].doc;
						doc.userlist.push(created.id);
						dbwaitlist.put(doc, function(err, response) {
							if (err) {
								res.sendStatus(400);
							}
							else {
								res.status(200).json(created);
							}
						});
						
					}
				});
		}
	});

});

app.delete('/waitlist/', function(req, res) {
	// dequeue
	dbwaitlist.allDocs({
		include_docs: true,
		attachments: true
	}, function(err, result) {
		if (err) {
			res.sendStatus(400);
		} else {
			var doc = result.rows[0].doc;
			// res.status(200).json(doc.userlist[0]);
			// return;
			// delete user
			dbuser.get(doc.userlist[0], function(err, found) {
				if (err) {
					res.sendStatus(400);
				} else {
					dbuser.remove(found, function(err, removed) {
						if (err) {
							res.sendStatus(400);
						} else {
							doc.userlist.shift();
							dbwaitlist.put(doc, function(err, result) {
								if (err) {
									res.sendStatus(400);
								} else {
									res.status(200).json(result);
								}
							});
						}
					});
				}
			});
		}
	});
});

// ====================
//   user resource
// ====================
app.get('/user/:id', function(req, res) {
	dbuser.get(req.params.id, function(err, found) {
		if (err) {
			res.sendStatus(400); 
		} else {
			res.status(200).json(found);
		}
	});
});

app.put('/user/', function(req, res) {
	// res.status(200).json(req.body);
	// return;
	// dbuser.get(req.body['_id'], funtion(err, found) {
		dbuser.put(req.body, function(err, found) {
		if (err) {
			res.sendStatus(400); 
		} else {
			res.status(200).json(found);
		}
		});
	// });
	
});



// // get(routes, callbacks)
// app.get('/posts/', function(req, res) {

// 	db.allDocs({
// 		include_docs: true,
// 		attachments: true

// 	}, function(err, result) {
// 		if (err) {
// 			res.sendStatus(400);
// 		} else {
// 			res.status(200).json(result);
// 		}
// 	});
// });

// app.post('/posts/', function(req, res) {
// 	var post = {
// 		title: req.body.title,
// 		post: req.body.post
// 	};

// 	db.post(post, function(err, created) {
// 		if (err) {
// 			res.sendStatus(400);
// 		} else {
// 			res.status(201).json(created);
// 		}

// 	});
// });

// app.delete('/posts/:id', function(req, res) {

// 	db.get(req.params.id, function(err, found) {
// 		if (err) {
// 			res.sendStatus(400); 
// 		} else {
// 			db.remove(found, function(err, removed) {
// 				if (err) {
// 					res.sendStatus(400);
// 				} else {
// 					res.sendStatus(202);
// 				}
// 			});
// 		}
// 	});


// });

// app.get('/app', function(req, res) {
// 	res.sendFile(__dirname + '/public/index.html');
// });


app.listen(3000, function() {
	console.log('Server running');
});