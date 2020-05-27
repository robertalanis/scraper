$(document).ready(function () {
    console.log("Hello World");
    


	$( ".save-note" ).click(function (event) {
		console.log("save-note clicked!");
        event.preventDefault();
		const button = $(this);
		const id = button.attr("id");
		$.ajax(`/save/${id}`, {
			type: "PUT",
		}).then(function () {
			console.log("Updated!");
        });
	});
});
