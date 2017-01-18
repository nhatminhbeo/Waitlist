$(document).ready(function(){
	var currentLocation = window.location.href;
	var splitstring = currentLocation.split('/');
	var id = splitstring[splitstring.length - 1];
	console.log(id);
	getPosts(id);
	// Handle  the buton click()
});

function getPosts(id) {

	// Reset content inside #content
	$("#content").text("");

	$.get('/waitlist/', function(data) {
		if(id == "restaurant") {
			$('#content').append('<div class="card"><form action="http://localhost:3000/app/restaurant"><button class="delete">Seat Next Person</button></form></div>')
		}
	// console.log(data);
		for (var i=0; i<data.length; i++) {
			// Find the important stuff inside data
			var name = data[i]["name"];
			var numberOfPeople = data[i]["guests"];
			var phoneNumber = data[i]['phone'];

			// Generate the html we want to insert
			var card='<div class="card"><h3 class="card--header">' +
				name + '</h3>' + 
				'Number of People:<p class="card--content">' + numberOfPeople + '</p>';
			// Insert the card HTML
			if(data[i]["_id"] == id){
				$('#content').append(card + '<button id="edit--post" onclick="location.href=\'/edit/' + id + '\';">Edit</button>');
			}
			else{
				$('#content').append(card);
			}
			$('#content').append('</div>');
		}
		$('.delete').click(function() {

			// Fire off that data
			$.ajax({
				url:"/waitlist/",
				type: 'DELETE',
				success: function(response) {
					console.log("deleted!");
				}
			});
		});		
	});
}