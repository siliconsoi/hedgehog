(function($){

	$('#to_json').on('click', save_data);

	function save_data(evt) {
		var $results = $('#results');
		evt.preventDefault();
		project = to_json($results);

		$.ajax({
			type: 'post',
			url: $results.attr('data-resource'),
			data: project,
			success: function(response){$('#link').attr('href', response.url).show(); },
			error: function(){console.log('something wrong!.');}
		});
	}

	function to_json($results){
		var $el, result = [];
		$results.find('.result').each(function(idx, el) {
			$el = $(el);
			result.push({
				url: $el.find('.url').attr('href'),
				note: $el.find('.note').val(),
				type: generate_types($el)
			});
		});
		return {project: result};
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

