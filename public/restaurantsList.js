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
// Update list 	|   /waitlist/ 		|   POST      | Create new user
// Delete list 	|   /waitlist/:id 	|   DELETE	  | Delete an user with id from waitlist
// Get user 	|	/user/:id 		| 	GET 	  | Get an user with id as json
// Edit user 	| 	/user/:id 		| 	PUT 	  | Edit an user with id as json
// =======================================================================
$(document).ready(function(){
	//var currentLocation = window.location.href;
	//var splitstring = currentLocation.split('/');
	//var id = splitstring[splitstring.length() - 1];
	getPosts();
	//handle the buton click()
});

function getPosts() {

	// Reset content inside #content
	$("#content").text("");

	$.get('/waitlist/', function(data) {
	// console.log(data);
		for (var i=0; i<data.length; i++) {
			// Find the important stuff inside data
			var name = data[i]["name"];
			var numberOfPeople = data[i]["guest"];
			var phoneNumber = data[i]['phone'];
			var id = data[i]['_id'];

			// Generate the html we want to insert
			var card='<div class="card"><h3 class="card--header">' +
				name + '</h3>' + 
				'number of people:<p class="card--content">' + numberOfPeople + '</p></div>';
			// Insert the card HTML
			$('#content').append(card + '<button id="edit--post" onclick="delete({{id}},{{i}})">delete</button>');

	});
}

function delete(id , i){
	$.delete('/waitlist' + id, function (data) {
		console.log(data);
		if(i == 0){
			//call to the backend to send text through twilio will be here 
			i = 1;
		}
		getPosts();
	});
}