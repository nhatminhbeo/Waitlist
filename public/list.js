$(document).ready(function(){
	getPosts();
	handle the buton click()
});

function getPosts() {

	// Reset content inside #content
	$("#content").text("");

	$.get('/posts/', function(data) {
	// console.log(data);
		var rows = data["rows"];
		for (var i=0; i<rows.length; i++) {
			// Find the important stuff inside data
			var title = rows[i]["doc"]["title"];
			var post = rows[i]["doc"]["post"];

			// Generate the html we want to insert
			var card='<div class="card"><h3 class="card--header">' +
				title + '</h3>' + 
				'<p class="card--content">' + post + '</p></div>';
			// Insert the card HTML
			$('#content').append(card);
		}
	});
}