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
	var currentLocation = window.location.href;
	getPosts(currentLocation);
	//handle the buton click()
});

function getPosts(url) {

	// Reset content inside #content
	$("#content").text("");

	$.get('/waitlist/', function(data) {
	// console.log(data);
		for (var i=0; i<data.length; i++) {
			// Find the important stuff inside data
			var name = data[i]["name"];
			var numberOfPeople = data[i]["guest"];
			var phoneNumber = data[i]['phone'];

			// Generate the html we want to insert
			var card='<div class="card"><h3 class="card--header">' +
				name + '</h3>' + 
				'number of people:<p class="card--content">' + numberOfPeople + '</p></div>';
			// Insert the card HTML
			if(data[i]["id"] == "{{id}}"){
				$('content').append(card + '<button id="edit--post" href="edit.html">edit</button>');
			}
			else{
				$('content').append(card);
			}
		}
	});
}