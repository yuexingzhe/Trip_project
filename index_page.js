$(function() {
	/*$(".slide_login .btn").click(function() {
		$.ajax({
			url: "http",
			type: "get",
			data: {
				user: "user",
				pass: "pass",
			},
			success: function(data) {
				if(typeof data == "string") {
					var data = JSON.parse(data);
				}
				if(data.status == 0) {
					$(".slide_login").remove();
				}else {
					alert("输入的个人信息有误...");
				}
			},
			error: function(req, msg) {
				alert("输入有误");
			}
		});
	});*/
	$(".slide_login .login").click(function(ev) {
		var ev = ev || event;
		var distance = $(ev.target).closest(".slide_login").offset();
		var left = distance.left;
		var top = distance.top;
		$(".cover").css({
			position: "absolute",
			left: left + "px",
			top: top + "px",
			zIndex: 200,
		});
		$(".cover").show();
	});
	$(".cover .out").click(function() {
		$(".cover").hide();
	});
});