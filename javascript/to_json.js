(function($){

	$('#to_json').on('click', save_data);

	$('#to_json').hide();

	$('#to_json').on('click', to_json);

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
		$.each($results.find('.result'), function(idx, el) {
			var $el = $(el),
				hash = {
					url: $el.find('.url').attr('href'),
					note: $el.find('.note').val(),
					types: generate_types($el)
				};
		});
	}

	$('#input_button').on('click', show_make_btn);

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

