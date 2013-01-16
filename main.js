
$(function(){

	$('form').ajax_form({
		success: process_results
	});

	function process_results (response){
		var title_with_tag = $(response).find('title');
		var title = title_with_tag.text();
		$('#results').append(title);
	}

});


(function($){

	$.ajax_form = {
		defaults: {
			success: function(){},
			error: function(error){ alert(error); }
		}
	};

	$.fn.ajax_form = function(options) {
		var opts = $.extend({}, $.ajax_form.defaults, options);
		this.each(function(idx, element){ ajax_form($(element), opts); });
		return this;
	};

	function ajax_form($form, opts) {

		$form.on('submit', submit_form);

		function submit_form(evt) {
			evt.preventDefault();
			$.ajax({
				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize(),
				success: opts.success,
				error: opts.error
			});
		}
	}

}(jQuery));


