$(document).ready(function() {
	// When the html page has been loaded, start here:
	// alert("Hello");

	$("form").submit(function(event) {
		// Will prevent default HTML form interaction
		event.preventDefault();

		// Gather data
		var name = $("#name").val();
		var numberOfPeople = $("#nop").val();
		var phoneNumber = $("#phoneNumber").val();

		var data = {
			name: name,
			numberOfPeople: numberOfPeople,
			phoneNumber: phoneNumber
		};

		//Fire off that data
		$.post("/waitlist/", data, function() {
			console.log("posted!");
		});
	});

});


