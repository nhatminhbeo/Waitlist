$(document).ready(function(){
	// var currentLocation = window.location.href;
	// var splitstring = currentLocation.split('/');
	// var id = splitstring[splitstring.length() - 1];
	// console.log(id);
	getPosts(10);
	//handle the buton click()
});

function getPosts(id) {

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
			if(data[i]["_id"] == id){
				$('#content').append(card + '<button id="edit--post" href="/edit/{{id}}">edit</button>');
			}
			else{
				$('#content').append(card);
			}
		}		
	});
}