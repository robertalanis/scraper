$(document).ready(function () {
    console.log("Hello World");
    
	$( ".save-article" ).click(function (event) {
		console.log("save-article clicked!");
        event.preventDefault();
		const button = $(this);
		const id = button.attr("id");
		$.ajax(`/save/${id}`, {
			type: "PUT",
		}).then(function () {
			console.log("Article Saved!");
			location.reload();
        });
	});

	$( ".remove-article" ).click(function (event) {
		console.log("remove-article clicked!");
        event.preventDefault();
		const button = $(this);
		const id = button.attr("id");
		$.ajax(`/remove/${id}`, {
			type: "PUT",
		}).then(function () {
			console.log("Article Removed!");
			location.reload();
        });
	});

});
