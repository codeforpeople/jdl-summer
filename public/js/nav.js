define(function () {
	var nav = function () {

		var navHandler = document.querySelector('.navigation-bar');

		var onScrollEvent = function (e) {
			console.log(e);
		};

		var init = function() {
			$(document).on('scroll', document, onScrollEvent);
		}

		return {
			init: init
		};
	}

	return nav();
});