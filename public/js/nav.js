define(function () {
	var nav = function () {

		var navHandler = document.querySelector('.navigation-bar');
		var navColor = 1;

		var ajustNavStyle = function (e) {
			var offsetX = $(window).scrollTop();

			if (offsetX > 650 && navColor === 0) {
				$(navHandler).css('background-color', 'rgba(0, 0, 0, .8)');
				navColor = 1;
				console.log(navHandler);
			} else if (offsetX < 650 && navColor === 1) {
				$(navHandler).css('backgroundColor', 'rgba(0, 0, 0, .3)');
				navColor = 0;
			}
		};

		var init = function() {

			ajustNavStyle();

			$('nav ul li a, nav ul li span, ul.nav li span, ul.nav li a, .btn.btn-link').click(function(e){
				$('html, body').animate({
					scrollTop: $($.attr(this, 'href')).offset().top - 75
				}, 500);
				e.preventDefault();
				return false;
			});

			$(document).on('scroll', document, ajustNavStyle);
		}

		return {
			init: init
		};
	}

	return nav();
});