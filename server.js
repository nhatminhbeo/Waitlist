var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var PORT = process.env.PORT || 80;

// THIS IS A TEST COMMENT
// THIS IS A SECOND COMMENT

// Create the database
var twilio = require('twilio')('AC8df14a0491d3751cbd3c36f40661c65f', 'b8e1b0e34b889a6e63766c3ce3500eb3');
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
// Index    	|   /app/       	|   GET       | Show the waitlist
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

app.get('/app/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
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
						console.log('j: ' + j);
						console.log('i: ' + i);
						if (j === result.rows[0].doc.userlist.length) {
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
							initsms(created.id, req.body.phone);
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
					var phone = found.phone;
					dbuser.remove(found, function(err, removed) {
						if (err) {
							res.sendStatus(400);
						} else {
							doc.userlist.shift();
							informsms(phone);
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

function initsms(id, phone) {
	twilio.sendSms({
	    to: phone,
	    from:'4157021794',
	    body:'Your waitlist page: https://restaurantwaitlist.herokuapp.com/app/' + id
	}, function(error, message) {
	    if (!error) {
	        console.log('Success! The SID for this SMS message is:');
	        console.log(message.sid);
	        console.log('Message sent on:');
	        console.log(message.dateCreated);
	    } else {
	        console.log('Oops! There was an error.');
	    }
	});
}

function informsms(phone) {
	twilio.sendSms({
	    to: phone,
	    from:'4157021794',
	    body:'Your seat is almost ready. Please start coming over!'
	}, function(error, message) {
	    if (!error) {
	        console.log('Success! The SID for this SMS message is:');
	        console.log(message.sid);
	        console.log('Message sent on:');
	        console.log(message.dateCreated);
	    } else {
	        console.log('Oops! There was an error.');
	    }
	});
}


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


app.listen(PORT, function() {
	console.log('Server running!');
});