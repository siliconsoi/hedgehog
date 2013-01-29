(function($){

	$.ajax_form = {
		defaults: {

			success: function(){},
			error: function(error){ alert("Sorry, we cannot found this site"); }
		}
	};

	$.fn.ajax_form = function(options) {
		var opts = $.extend({}, $.ajax_form.defaults, options);
		this.each(function(idx, element){ ajax_form($(element), opts); });
		return this;
	};

	function ajax_form($form, opts) {
		add_http(evt);
		$form.on('submit', submit_form);

		function submit_form(evt) {
			evt.preventDefault();
			add_http();
			$.ajax({
				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize(),
				success: opts.success,
				error: opts.error
			});
		}
	}

	function add_http (evt) {
		// body...
	}

}(jQuery));
