(function($){

	$('#to_json').on('click', save_data);

	function save_data(evt) {
		var $results = $('#results');
		evt.preventDefault();
		project = to_json($results);

		$.ajax({
			type: $results.attr('data-method'),
			url: $results.attr('data-resource'),
			data: project,
			success: save_done,
			error: function(){console.log('something wrong!.');}
		});
	}

	function save_done(response){
		$('#link').attr('href', response.url).show();
		$('#results').attr('data-resource', response.url).attr('data-method', 'put');
	}

	function show_make_btn(){
		if ($('.result').length >= 0){
			$('#to_json').show();
		}
	}

	function to_json($results){
		var $el, result = [];
		$results.find('.result').each(function(idx, el) {
			$el = $(el);
			result.push({
				url: $el.find('.url').attr('href'),
				title: $el.find('.title, .hotel_name').text(),
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

