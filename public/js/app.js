$(document).ready(function () {
	console.log("Hello World");

	$(".save-article").click(function (event) {
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

	$(".remove-article").click(function (event) {
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

	$(".create-note").on("click", function (event) {
		console.log("create-note clicked!");
		// Grab the id associated with the article from the submit button
		var thisId = $(this).attr("data-id");
		console.log($("#note-body" + thisId).val());
		if (!$("#note-body" + thisId).val()) {
			alert("please enter a note to save");
		} else {
			$.ajax({
				method: "POST",
				url: "/newnote/" + thisId,
				data: {
					text: $("#note-body" + thisId).val(),
				},
			}).then(function (data) {
				console.log(data)
			});
		}
	});
});
