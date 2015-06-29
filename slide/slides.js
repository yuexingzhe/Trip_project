$(function() {
	var num = 0, 
		auto = '';

// 第一个下方导航按钮点亮
	$(".nav .tips span").eq(0).css("background", "#fff");

// 自动播放效果
	var auto_play = function() {
		var $content_list = $(".wrap .content_list");
		var width = $(".content").width();
		var len =  $(".content_list li").length;
		if(num == len-1) {
			num = 0;
		}else {
			num = num+1;
		}
		$(".nav .tips span").eq(num).css("background", "#fff").siblings().css("background", "#999");
		$content_list.animate({
			left: "-" + num*width + "px",
		},"slow");
	};
	auto = setInterval(auto_play, 3000);

// 点击下方导航按钮后效果
	$(".nav .tips span").click(function() {
		clearInterval(auto);
		$(this).css("background", "#fff").siblings().css("background", "#999");
		var index = $(this).index();
		var $wrap = $(this).closest(".wrap");
		var $content = $wrap.find(".content");
		var width = $content.width();
		var $content_list = $wrap.find(".content_list");
		num = index;
		if(!$content_list.is(":animated")) {
			$content_list.animate({
				left: "-" + index * width + "px",
			},"slow");
		}
	});

// 鼠标移入后效果	
	$(".wrap").mouseover(function() {
		clearInterval(auto);
	});

// 鼠标移出后效果
	$(".wrap").mouseout(function() {
		auto = setInterval(auto_play, 3000);
	});
});