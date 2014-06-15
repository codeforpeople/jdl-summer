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
				$('.btn-send-application').hide();

				var iframe = document.createElement('iframe');
				iframe.classList.add('apply-frame');
				iframe.setAttribute('seamless', '');
				iframe.setAttribute('src', '/auth?id=' + id);

				document.querySelector('#auth-modal').appendChild(iframe);
				$('#project-apply-modal').modal('show');
			
				checkApplicationStatus(id, function (res) {
					if (res.status === 1) {
						$('.btn-send-application').show();
					}
				});

			});
			
		};

		var applyToProject2 = function (e) {
			$('#project-details-modal').modal('hide');
			window.setTimeout(function () {
				applyToProject(e)
			}, 350);	
		};

		var sendApplication = function (e) {
			var iframe = document.querySelector('#auth-modal iframe');
			var iframe_doc = (iframe.contentWindow || iframe.contentDocument);
			if (iframe_doc.document) {
				var doc = iframe_doc.document;

				var appForm = doc.querySelector('form');
				if (appForm) appForm.submit()
			}

			$('.btn-send-application').hide();
		};

		var sendMessage = function (e) {

			e.preventDefault();
			console.log('send');

			var name = $('#name').val();
			var email = $('#email').val();
			var content = $('#content').val();

			var safe = true;

			if (name.length === 0) {
				safe = false;
				$('#name').parent().addClass('has-error');
			} else {
				$('#name').parent().removeClass('has-error');
			}


			if (email.length === 0) {
				safe = false;
				$('#email').parent().addClass('has-error');
			} else {
				$('#email').parent().removeClass('has-error');
			}


			if (content.length === 0) {
				safe = false;
				$('#content').parent().addClass('has-error');
			} else {
				$('#content').parent().removeClass('has-error');
			}

			if (safe) {

				$('.btn-send-message').text('Se trimite...');
				$('.contact-form fieldset').attr('disabled', '');

				$.ajax({
					type: 'post',
					url: '/contact',
					data: {
						name: name,
						email: email,
						content: content
					},
					dataType: 'text',
					success: function (res) {
						$('#contact-modal .modal-content').html(res);
						$('#contact-modal').modal('show');
						$('.btn-send-message').text('Trimite');
						$('.contact-form fieldset').removeAttr('disabled');
					},
					error: function (a,b,c) {
						console.log(c);
					}
				});
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

			$(document).on('click', '.btn-project-details', loadProjectDetails);
			$(document).on('click', '.btn-project-apply', applyToProject);
			$(document).on('click', '.btn-apply2', applyToProject2);
			$(document).on('click', '.btn-send-application', sendApplication);
			$(document).on('click', '.btn-send-message', sendMessage);
			$(document).on('scroll', document, ajustNavStyle);
		}

		return {
			init: init
		};
	}

	return nav();
});