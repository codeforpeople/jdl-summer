(function () {

	var map = null;
	var mapCanvas = null;
	var mapOptions = null;
	var userPosition = null;
	var geocoder = null;
	var kmlOptions = null;
	var kmlUrl = null;
	var kmlLayer = null;
	
	var locationReady = function (location) {
		
		if (location === null) {
			console.log('[ERROR] Location unavailable.');
			return;
		}

		userPosition = new google.maps.LatLng(location.coords.latitude,
			location.coords.longitude);

		map.setCenter(userPosition);
		map.setZoom(12);

		console.log(userPosition);
	}

	var main = function () {

		console.log('Team First Card Location Based Map Script');

		mapCanvas = document.getElementById('map');
		mapOptions = {
			zoom: 2,
			center: { lat: 0, lng: 0}
		};


		map = new google.maps.Map(mapCanvas, mapOptions);
		
		kmlUrl = 'http://www.jdl.ro/extern/tfc.kml';
		kmlOptions = {
			map: map,
			preserveViewport: true,
			suppressInfoWindows: false
		};
		
		kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
		
		geocoder = new google.maps.Geocoder();
		userPosition = navigator.geolocation.getCurrentPosition(locationReady);
	};

	return main();
})();