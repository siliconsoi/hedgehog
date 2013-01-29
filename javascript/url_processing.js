var url_processing = (function($){

	var api = {init: init, append_result: append_result};

	function init(){
		$('form').ajax_form({
			success: process_results
		});
		return api;
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

	function append_result(result, disposition) {
		var tmpl = $('#tmpl-result').text(),
			type_partial = $('#tmpl-content-type').text(),
			content = Mustache.render(tmpl, result, {content_type: type_partial});
		disposition = disposition || 'prepend';
		$('#results')[disposition](content);
		$('#to_json').show();
		console.log(result);
	}

	return api;

}(jQuery));
