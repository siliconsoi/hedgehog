(function($){

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
		console.log($note.is(':visible'));
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
		$('#results').prepend(content);

	}



}(jQuery));




