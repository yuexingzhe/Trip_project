$(function() {

	var indexCenter = new google.maps.LatLng(23.14746, 113.34175376);//中心点

	var myGoogleMaps = null;	
		var markers = [];
	google.maps.event.addDomListener(window, 'load', initialize);

	//创建地图,并初始化			
	function initialize(){ 
		var mapOptions = {
			zoom: 4,//缩放比例
			center: indexCenter,					
			zoomControlOptions: {
			  position: google.maps.ControlPosition.RIGHT_TOP 
			},
			panControl: false,//选择位置的那个上下左右圈不显示
			zoomControl: true,//显示放大缩小的按钮
			mapTypeControl: true,//显示地图类型供选择
			streetViewControl: false,//让地图上的人不显示
			scaleControl: true//缩放比例显示
		  }

		//map = new google.maps.Map(document.getElementById("map"), mapOptions);
		map = new google.maps.Map(document.getElementById("myGoogleMap"), mapOptions);
	    //把map对象返回给全局变量.用来处理其他事件.
		myGoogleMaps = new MyGoogleMaps(map);//实例化我的地图,并把map传递进去


		myGoogleMaps.addMarker(indexCenter,true);
	};




	$(window).scroll(function() {
		var bottom = $("#footer").offset().top;
		var bottom_val = bottom - $(".pl_right").height();

		if($(this).scrollTop() > 600 && $(this).scrollTop() < bottom_val) {
			$(".pl_right").addClass("fixed");
		}else {
			$(".pl_right").removeClass("fixed");
		}
		if(($(this).scrollTop() > bottom_val)){
			$(".pl_right").addClass("fixedBottom");
		}else {
			$(".pl_right").removeClass("fixedBottom");
		}

		if($(window).scrollTop() > 300) {
			$(".ui_upward_wrapper").show();
		}else {
			$(".ui_upward_wrapper").hide();
		}

	});

	$(".ui_upward_icon").click(function() {
		window.scrollTo(0,0);
	});

});
