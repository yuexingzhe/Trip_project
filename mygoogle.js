/*创建我的googleMaps对象*/
function MyGoogleMaps(map){
	this.map = map;//把map通过构造函数传递进来
	this.lastPoint = null;//画线时使用,记录连线时的最后一个点
	this.distanceCount = 0;//计算距离使用
	this.geocoder = new google.maps.Geocoder();//申明地址解析对象
}

MyGoogleMaps.prototype = {
	/*传两个值 ,location 是位置信息的点,icon是标记的图标地址,默认为空.*/
	addMarker : function(pointer,isMoveToPointer,title,icon) {
		var icon = icon || "";/*如果icon没有传,则默认为空*/
		var title = title || "";
		var marker = new google.maps.Marker({		
			position: pointer,
			icon:icon,
			map: this.map,/*draggable:true,*/
			title: title
		});

		if(isMoveToPointer){this.moveToCenter(marker);}//是否移动到以这点为中心点的位置
		markers.push(marker);
		return marker;
	},
	/*增加一个带信息提示框的标记 .*/
	addMarkerAndInfo: function(pointer,isMoveToPointer,info,title,icon) {
		var icon = icon || "";/*如果icon没有传,则默认为空*/
		var title = title || "";
		var marker = new google.maps.Marker({		
			position: pointer,
			icon:icon,
			map: this.map,
			title: title
		});
		var infowindow = new google.maps.InfoWindow({
		     content:info			 
		 });
		infowindow.open(this.map,marker);//打开信息窗口

		this.addMyListener(marker,'click',function(){//点击则显示
			infowindow.open(this.map,marker);
		});
		if(isMoveToPointer){this.moveToCenter(marker);}//是否移动到以这点为中心点的位置
		markers.push(marker);
		return marker;
	},
	addDropMarker: function(parliament,icon){//增加一个会跳动的标记
		var icon = icon || "";/*如果icon没有传,则默认为空*/
		var marker = new google.maps.Marker({
			map:this.map,
			icon:icon,
			draggable:false,
			animation: google.maps.Animation.DROP,
			position: parliament
		});
		//this.moveToCenter(marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);	
		return marker;		
	},
	removeDropMarker: function(marker){//移除会跳动的marker
		if (marker.getAnimation() != null) {
			marker.setAnimation(null);
		}
		//marker.setAnimation(null);
		marker.setMap(null);
	},
	setAllMap: function(map) {/*设置所有的标记,为null时则为移除,为map对象时则为添加显示*/
	    for (var i = 0; i < markers.length; i++) {
		    markers[i].setMap(map);
	    }
	},
	clearMarkers: function(){/*从地图上隐藏所有markers中的标记,但是所有的点信息还保存的数组markers中*/
		this.setAllMap(null);
	},
	showMarkers: function() {/*显示所有markers中的标记*/
	    setAllMap(this.map);
	},
	deleteMarkers: function() {/*移除所有markers中的标记*/
	    clearMarkers();
	    markers = [];
	},
	deleteOneMarker: function(marker){/*移除某个marker标记*/
		marker.setMap(null);
		
		if (markers) {//把这个marker从数组中markers中移除
			var index = -1;			
			for (j in markers) {
				if (this[j] == marker) index = j;
				break;
			}
			if (index > -1) {
				markers.splice(index, 1);
			}
		}
	},
	/*移动到中心点marker处,并把大小放大到size尺寸*/
	moveToCenter: function(marker,size){
		if(size) map.setZoom(size);
		this.map.panTo(marker.getPosition());
	},
	/*在地图上画线(连接两个点),marker1,marker2分别为两个点,isShowMarker是否加载标记点,mycolor为线条的颜色,可不传*/
	drawTrip: function(marker1,marker2,isShowMarker,mycolor){
		var mycolor = mycolor || "#0000FF";//如果颜色值没值则用默认值
		var myPath = [marker1,marker2];
		var returnArr = [];
		var marks = [];
		if(isShowMarker){//如果为true,则显示标记,默认为true
			marks.push(this.addMarker(marker1));
			marks.push(this.addMarker(marker2));
		}
		var flightPath=new google.maps.Polyline({
			path:myPath,
			strokeColor:mycolor,
			strokeOpacity:0.8,
			strokeWeight:2
	    });

		flightPath.setMap(this.map);
		returnArr.push(marks);
		returnArr.push(flightPath);
		return returnArr;//把线条与行程线打包返回,清除时可以用到
	},
	/*画多个点组成的数组 为一条线*/
	drawArrayTrip: function(tripArray, isShowMarker, mycolor){
		var mycolor = mycolor || "#0000FF";//如果颜色值没值则用默认值	
		var returnArr = [];
		returnArr.push(tripArray);
		if(isShowMarker){//如果为true,则显示标记,默认为true
			for(var i=0;i<tripArray;i++){
				this.addMarker(tripArray[i]);
			}			
		}
		var flightPath=new google.maps.Polyline({
			path:tripArray,
			strokeColor:mycolor,
			strokeOpacity:0.8,
			strokeWeight:2
	    });
		returnArr.push(flightPath);
		flightPath.setMap(this.map);
		return returnArr;//把线条与行程线打包返回,清除时可以用到
	},
	/*在地图上点击时增加一个标记,第二次点击时连接这两条线*******************待完成*/
	clickAddMarkerAndDrawPath: function(point,isShowInfo,info){
		//先得到这次点击的地理位置的信息并封装成new google.maps.LatLng(lat,lng);的信息
		//google.maps.event.addListener(map, 'click', function(event) {
		//	placeMarker(event.latLng,isShowInfo,info);
		//});
		var returnArr = [];
		var marker = new google.maps.Marker({
			 position: point,
			 map: this.map,
	    });		

		//this.getAddressNameByLatLng(point);//根据经纬度得出街道地址信息

		//this.getLatLngByAddress("US");//根据地址解析经度与纬度


		if(this.lastPoint == null){//如果是第一次点击,则添加标记,并记录这个点
			this.lastPoint = point;
			returnArr.push(marker);
		}else{//如果不是第一次点击,则连接这点与上一个点,并更新上一个点的标记为这次点击的标记.
			returnArr =	this.drawTrip(this.lastPoint,point);
			this.distanceCount += this.distanceAToB(this.lastPoint,point);//计算总距离
			returnArr.push(this.distanceCount);
			this.lastPoint = point;
		}

		if(isShowInfo){
			var infowindow = this.placeMarker(marker,info);
			returnArr.push(infowindow);
		}
		return returnArr;
	},
	placeMarker: function(marker,info) {
		var infowindow = new google.maps.InfoWindow({
			content: info
		});
		infowindow.open(this.map,marker);
		return infowindow;
	},
	clearTrip: function(flightPath){//清除的时候怎么移除线两端的标记
		flightPath.setMap(null);
	},
	distanceAToB: function(point1,point2){
		 //根据经纬度计算两点距离  
		  var marker1 = new google.maps.Marker({
				position: point1,
				title:"old"
		  });
		  var marker2 = new google.maps.Marker({
				position: point2,
				title:"new"
		  });
		  var meters = google.maps.geometry.spherical.computeDistanceBetween(marker1.getPosition(), marker2.getPosition()); 
		  return parseInt(meters/1000,10); //返回公里(km) 
	},
	addMyListener: function(obj,eventType,callback){//增加监听事件
		google.maps.event.addListener(obj,eventType,function() {
		   callback();
		});
	},
	//根据经纬度获取城市名称(这请求google maps api对请求的次数有限制)
	getAddressNameByLatLng: function(location){
		var address = "";
		//var geocoder = new google.maps.Geocoder();
		if (this.geocoder) {  
		  this.geocoder.geocode({'location': location}, function(results, status) {  
			   // console.log(results);
				if (status == google.maps.GeocoderStatus.OK) {  
					 if (results[0]) {  
						//alert(results[0].formatted_address);  
						address = results[0].formatted_address;
					 }   
				} else {  
					//alert("Geocoder failed due to: " + status);  
					address = "Geocoder failed due to: " + status;
					/* status的值有如以下:
					"OK"，用于表示未发生错误；已成功进行了地理编码且至少返回了一个地理编码结果。
					"ZERO_RESULTS"，用于表示地理编码成功，但未返回任何结果。如果地理编码过程中传递的偏远位置 address 或 latlng 并不存在，就会出现这种情况。
					"OVER_QUERY_LIMIT"，用于表示您超出了自己的配额。
					"REQUEST_DENIED"，用于表示您的请求遭拒，这通常是由于缺少 sensor 参数。
					"INVALID_REQUEST"，通常用于表示缺少查询内容（address 或 latlng）。
					*/
				}  
		  });  
		} 
		return address;
	},
	//根据地理名称获取经度纬度,
	getLatLngByAddress: function(address){
		if (this.geocoder) {  
			this.geocoder.geocode({'address': address/*,"language":"zh_cn"*/}, function(results, status) {  
				if (status == google.maps.GeocoderStatus.OK) {  
					if(results[0]){  
						var point = results[0].geometry.location;  
						this.map.setCenter(point);  
						console.log(point);
					}  
				} else {  
					alert("Geocode was not successful for the following reason: " + status);  
				}  
			});  
		}  
	}
};