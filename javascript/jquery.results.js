(function($){

	$.results = {
		defaults: {}
	};

	$.fn.results = function(options) {
		var opts = $.extend({}, $.results.defaults, options);
		this.each(function(idx, element){ results($(element), opts); });
		return this;
	};

	function results($container, opts) {

		$container.on('click', '.add-note-btn', add_note);
		$container.on('click', '.remove-result-btn', remove_result);
		$container.on('click', '.content-btn', add_sign_btn);


		function add_note(evt){
			evt.preventDefault();
			$note = $(evt.currentTarget).closest('.result').find('.note');
			$note.toggle();
		}

		function add_sign_btn(evt){
			evt.preventDefault();
			$(evt.currentTarget).toggleClass('selected');
		}

		function remove_result(evt){
			evt.preventDefault();
			$(evt.currentTarget).closest('.result').remove();
		}
	}

}(jQuery));
