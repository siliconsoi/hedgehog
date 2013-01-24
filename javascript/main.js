(function($){

	if( HH.project ) {
		$.each(HH.project, function(idx, result){ append_result(result, 'append'); });
	}

	$('#results').orderable();

	$('#loading_data').hide().ajaxStart(function(){
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
	});

	$('form').ajax_form({
		success: process_results
	});
	$('#results').on('click', '.add-note-btn', add_note);

	function add_note(evt){
		evt.preventDefault();
		$note = $(evt.currentTarget).closest('.result').find('.note');
		if ($note.is(':visible')){
			$note.hide();
		}
		else{
			$note.show();
		}
	}

	$('#results').on('click', '.remove-result-btn', remove_result);
	$('#results').on('click', '.content-btn', add_sign_btn);


	function add_sign_btn(evt){
		evt.preventDefault();
		$(evt.currentTarget).toggleClass('selected');
	}

	function remove_result(evt){
		evt.preventDefault();
		$(evt.currentTarget).closest('.result').remove();
		if ($('.result').length < 1){
			$('#to_json').hide();
		}
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
		var tmpl = $('#tmpl-result').html(),
			type_partial = $('#tmpl-content-type').html(),
			content = Mustache.render(tmpl, result, {content_type: type_partial});
		disposition = disposition || 'prepend';
		$('#results')[disposition](content);
		$('#to_json').show();
	}

}(jQuery));
