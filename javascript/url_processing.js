var url_processing = (function($){

	var api = {init: init, append_result: append_result};

	function init(){
		$('form').ajax_form({
			data: url_submission_data,
			success: process_results
		});
		return api;
	}

	function url_submission_data($form) {
		var data = $form.serializeArray(), url;

		$.each(data, function(i, e){
			if( e.name !== 'url' ) { return; }
			e.value =  !(/^http/.test(e.value)) ? 'http://' + e.value : e.value;
		});

		return data;
	}

	function process_results (response){
		handlers = find_handlers(response.url);
		details = extract(response.url, response.body, handlers);
		console.log('raw data', details);
		result = refine(details);
		console.log('to the template', result);
		append_result(result);
	}

	function find_handlers(url) {
		var handlers = [];
		$.each(translators, function(idx, el){
			if( el.urlRegex.test(url) ) { handlers.push(el); }
		});
		return handlers;
	}

	function extract(url, body, handlers) {
		var extracted = [];
		$.each(handlers, function(idx, handler){
			var context = $.extend({}, handler, {url: url});
			extracted.push(handler.decoder(body, context));
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
	}

	return api;

}(jQuery));
