var translators = [{
	urlRegex:  /agoda.co/,
	decoder: function(){}
}, {
	urlRegex:  /booking.co/,
	decoder: function(){}
}, {
	urlRegex: /.*/,
	decorder: title_extractor
}];


function title_extractor(body) {
	var head  = body.match(/<head>.*<\/head>/)[0];
		title = $(head).find('title').text();
	return {extractor: 'title', data: {title: title}};
}





$(function(){

	$('form').ajax_form({
		success: process_results
	});

	function process_results (response){
		handlers = find_handlers(response.url);
		// results = translate(response.body);
	}

	function find_handlers(url) {
		var handlers = [];
		$.each(translators, function(idx, el){
			if( el.urlRegex.test(url) ) { handlers.push(el); }
		});
		return handlers;
	}

});

(function($){

	$.ajax_form = {
		defaults: {

			success: function(){},
			error: function(error){ alert(error); }
		}
	};

	$.fn.ajax_form = function(options) {
		var opts = $.extend({}, $.ajax_form.defaults, options);
		this.each(function(idx, element){ ajax_form($(element), opts); });
		return this;
	};

	function ajax_form($form, opts) {

		$form.on('submit', submit_form);

		function submit_form(evt) {
			evt.preventDefault();
			$.ajax({
				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize(),
				success: opts.success,
				error: opts.error
			});
		}
	}

}(jQuery));


