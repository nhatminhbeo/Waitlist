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
$(document).ready(function() {
	// When the html page has been loaded, start here:
	// alert("Hello");

	$("form").submit(function(event) {
		// Will prevent default HTML form interaction
		event.preventDefault();

		// Gather data
		var name = $("#name").val();
		var guests = $("#nop").val();
		var phone = $("#phoneNumber").val();

		var data = {
			name: name,
			guests: guests,
			phone: phone
		};

		//Fire off that data
		$.post("/waitlist/", data, function() {
			console.log("posted!");
		});
	});

});


