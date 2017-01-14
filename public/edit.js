$document.ready(function(){
	var currentLocation = window.location.href;

	//returns an array of all the string's parts
	var splitstring = currentLocation.split('/');
	//the id should be in this last array index 
	var id = splitstring[splitstring.length() - 1];

	$.get("/user/" + id , function(data){
		$('#name').append(data["name"]);
		$('#phone').append(data["phone"]);
		$('#nop').append(data["guest"]);
	});	

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
		$.put("/user", data, function() {
			console.log("posted!");
		});
	});
});