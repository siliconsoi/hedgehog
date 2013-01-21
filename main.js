(function($){

	$('#loading_data').hide().ajaxStart(function(){
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
	});

	$('form').ajax_form({
		success: process_results
	});

	$('#results').on('click', '.remove-result-btn', remove_result);
	$('#results').on('click', '.sign_btn', add_sign_btn);

	function add_sign_btn(evt){
		evt.preventDefault();
		if ($(evt.currentTarget).attr('src') == 'image/Yellow-icon.png'){
			$(evt.currentTarget).attr('src','image/Gray-icon.png');
		}else{
			$(evt.currentTarget).attr('src','image/Yellow-icon.png');
		}
	}

	function remove_result(evt){
		evt.preventDefault();
		$(evt.currentTarget).closest('.result').remove();
	}

	function process_results (response){
		handlers = find_handlers(response.url);
		details = extract(handlers, response.body);
		result = refine(details);
		append_result($.extend({}, result, {url: response.url}));
	}

	function find_handlers(url) {
		var handlers = [];
		$.each(translators, function(idx, el){
			if( el.urlRegex.test(url) ) { handlers.push(el); }
		});
		return handlers;
	}

	function extract(handlers, body) {
		var extracted = [];
		$.each(handlers, function(idx, handler){
			extracted.push(handler.decoder(body));
		});
		return extracted;
	}

	function refine(details) {
		result = {};
		$.each(details, function(index, detail){
			result = $.extend(result, detail.data);
		});
		return result;
	}

	function append_result(result) {
		var tmpl = $('#tmpl-result').html(),
			content = Mustache.to_html(tmpl, result);
		$('#results').append(content);

	}

}(jQuery));

// $(function(){
// 	$('.tick-review-btn').on('click', function(evt){
// 		evt.preventDefault();
// 		alert('Reviews');
// 	});
// });




