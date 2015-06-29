$(function() {
	$(".content .side a").click(function() {
		$(this).addClass("add").siblings().removeClass("add");
	});
});