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
				$(navHandler).css('backgroundColor', 'rgba(0, 0, 0, .8)');
				navColor = 0;
			}
		};

		var createDescription = function (desc, mentor, skills) {
			description = document.createElement('p');
			description.innerHTML = desc;

			mentorBox = document.createElement('div');
			mentorBox.classList.add('mentor-info');

			mentorName = document.createElement('p');
			mentorName.classList.add('mentor-name');
			mentorName.innerHTML = mentor.name;

			mentorEmail = document.createElement('p');
			mentorEmail.classList.add('mentor-email');
			mentorEmail.innerHTML = mentor.email;

			skillsList = document.createElement('div');
			skillsList.classList.add('skill-list');

			for (var i = skills.length - 1; i >= 0; i--) {
				var skill = document.createElement('span');
				skill.classList.add('skill-item');
				skill.innerHTML = skills[i];
				skillsList.appendChild(skill);
			};

			mentorBox.appendChild(mentorName);
			mentorBox.appendChild(mentorEmail);

			mainBody = document.querySelector('#project-details-modal .modal-body');
			mainBody.innerHTML = '';

			mainBody.appendChild(description);
			mainBody.appendChild(mentorBox);
			mainBody.appendChild(skillsList);
		}

		var loadProjectDetails = function (e) {
			var id = $(this).parents('.project').attr('id');

			$('#project-details-modal .modal-title').text('Loading...');
			$('#project-details-modal .modal-body').text('Loading...');
			
			$.ajax({
				type: 'post',
				url: '/sync',
				data: {id: id},
				dataType: 'json',
				success: function (res) {
					console.log(res);
					if (res.status === 0) {
						$('#project-details-modal .modal-title').text(res.data.name);
						createDescription(res.data.longDescription, res.data.mentor, res.data.skillsNeeded);
					}
				},
				error: function (a,b,c) {
					$('#project-details-modal .modal-body').text(c);
				}
			});
		};

		var checkApplicationStatus = function (id, cb) {
			$.ajax({
				type: 'post',
				url: '/check',
				data: {id: id},
				dataType: 'json',
				success: function (res) {
					cb(res);
				},
				error: function (a,b,c) {
					cb(null);
					window.alert(c);
				}
			});
		};

		var registerProjectWithUser = function (id) {
			$.ajax({
				type: 'post',
				url: '/check',
				data: {id: id},
				dataType: 'json',
				success: function (res) {
					cb(res);
				},
				error: function (a,b,c) {
					cb(null);
					window.alert(c);
				}
			});
		};

		var loginWithFacebook = function (cb) {
			var w = window.open('/auth/facebook');
			var interval = window.setInterval(function() {
		        try {
		            if (w == null || w.closed) {
		                window.clearInterval(interval);
		                cb();
		            }
		        }
		        catch (e) {
		        }
		    }, 1000);
		};

		var applyToProject = function (e) {
			var id = $(this).parents('.project').attr('id');
			loginWithFacebook(function () {
				$('#auth-modal').text('');

				var iframe = document.createElement('iframe');
				iframe.classList.add('apply-frame');
				iframe.setAttribute('seamless', '');
				iframe.setAttribute('src', '/auth');

				document.querySelector('#auth-modal').appendChild(iframe);
				$('#project-apply-modal').modal('show');

				// checkApplicationStatus(id, function (result) {
				// 	console.log(result);
				// 	if (result.status === 0) {
				// 		// we need authentification
				// 		var w = window.open('/auth/facebook');
				// 		var interval = window.setInterval(function() {
				// 	        try {
				// 	            if (w == null || w.closed) {
				// 	                window.clearInterval(interval);
				// 	                checkApplicationStatus(id, function (result) {
				// 	                	if (result.status === 1) {
				// 	                		if (result.duplicate === 0)
				// 	                			registerProjectWithUser(id);
				// 	                		else {
				// 	                			// duplicate
				// 	                		}
				// 	                	}
				// 	                });
				// 	            }
				// 	        }
				// 	        catch (e) {
				// 	        }
				// 	    }, 1000);

				// 	} else {
				// 		if (result.duplicate === 0)
				// 			registerProjectWithUser(id);
				// 		else {
				// 			// duplicate
				// 		}
				// 	}
				// });
			
			});
			
		};

		var applyToProject2 = function (e) {
			$('#project-details-modal').modal('hide');
			window.setTimeout(function () {
				applyToProject(e)
			}, 350);	
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

			$(document).on('click', '.btn-project-details', loadProjectDetails);
			$(document).on('click', '.btn-project-apply', applyToProject);
			$(document).on('click', '.btn-apply2', applyToProject2);
			$(document).on('scroll', document, ajustNavStyle);
		}

		return {
			init: init
		};
	}

	return nav();
});