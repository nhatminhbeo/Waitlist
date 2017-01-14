

// Create the database
// var PouchDB = require('pouchdb');
// var db = new PouchDB('workshop');


// =========================
// App Configs
// =========================
// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(logger('dev'));
// app.disable('x-powered-by');
// Allowing CORS
// app.use(function(req,res,next) {
// 	res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
// 	res.append('Access-Control-Allow-Credentials', 'true');
// 	res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
// 	res.append('Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept');
// 	next();
// });
// app.enable('trust proxy');


// =======================================================================
// RESTful Routes
// HTTP Verbs: GET, POST, PUT, DELETE
//
// Name     |   Path      |   HTTP Verb |   Purpose
// =======================================================================
// Index    |   /         |   GET       | List all the posts
// Create   |   /         |   POST      | Create a new post
// Show     |   /:id      |   GET       | Show a single post
// Update   |   /:id      |   PUT       | Update a particular post
// Delete   |   /:id      |   DELETE    | Delete a particular post
// =======================================================================
