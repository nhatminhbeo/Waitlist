$(document).ready(function(){
	var currentLocation = window.location.href;

	//returns an array of all the string's parts
	var splitstring = currentLocation.split('/');
	//the id should be in this last array index 
	var id = splitstring[splitstring.length - 1];

	$.get("/user/" + id , function(data){
		//console.log(data);
		$('#name').val(data["name"]);
		$('#phone').val(data["phone"]);
		$('#nop').val(data["guests"]);
	});	

	$("form").submit(function(event) {
		// Will prevent default HTML form interaction
		event.preventDefault();

		var currentLocation = window.location.href;
		var splitstring = currentLocation.split('/');
		var id = splitstring[splitstring.length - 1];

		// Gather data
		var name = $("#name").val();
		var guests = $("#nop").val();
		var phone = $("#phoneNumber").val();

		

		$.get("/user/" + id , function(data){
			var rev = data["_rev"];
			var preferences = data["preferences"];
			var data = {
				name: name,
				guests: guests,
				phone: phone ,
				guests: guests,
				preferences: preferences,
				_id : id, 
				_rev : rev
			};

			//Fire off that data
			$.ajax({
				url:"/user",
				data:data,
				type: 'PUT',
				success: function(response) {
					console.log("posted!");
				}
			});
		});
	});
});

