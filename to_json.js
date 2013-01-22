(function($){

	$('#to_json').on('click', to_json);

	function to_json(evt){
		evt.preventDefault();
		var $results = $(evt.currentTarget).closest('#results'),
			collector = [];
		$.each($results.find('.result'), function(idx, el, collector) {
			// console.log( $(el).find('.note').length, idx );
			var $el = $(el),
				hash = {
					url: $el.find('.url').attr('href'),
					note: $el.find('.note').val(),
					types: generate_types($el)
				};
			// hash.push(collector);
			console.log(hash);
		});
		// console.log($results.find('.result'), $results.find('.result').length);
	}


	function generate_types($result) {
		var result = {};
		$result.find('.content-btn.selected').map(to_content_type).each(to_hash);
		return result;

		function to_content_type(idx, button){
			return $(button).attr('data-content-type');
		}

		function to_hash(idx, type) {
			result[type] = true;
		}

	}

}(jQuery));

