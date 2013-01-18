var translators = [{
	urlRegex: /.*/,
	decoder: handler(title_element)
}, {
	urlRegex: /^.+agoda.co.+$/,
	decoder: handler(agoda_hotel)
}];

function handler(fn) {
	return function(body) {
		console.log('applying ' + fn.name);
		return $.extend({}, fn(body), {extractor: fn.name});
	};
}

function title_element(body) {
	var title  = body.match(/<title>([\s\S]*)<\/title>/);
	return {data: {title: title[1] ? title[1] : null}};
}

function agoda_hotel(body) {
	// var hotel_name = response;
	// website = ($('#input_url').val()).split('.')[1];
	// regex = "";
	// if (website == 'agoda') {
	//    	regex = /<h1 *itemprop="name">([\s\S]*)<\/h1>/i;
	// }else if (website == 'booking') {
	// 	regex = /<h1 *class="item">([\s\S]*)<\/h1>/;
	// }else if (website == 'tripadvisor'){
	// 	regex = /<h1 *id="HEADING" *property="v:name">([\s\S]*)<\/h1>/;
	// }else {
	// 	regex = /<title>([\s\S]*)<\/title>/i;
	// }
	return {data: null};
}

// -------------------------------------------------------------------

$(function(){

	$('form').ajax_form({
		success: process_results
	});

	function process_results (response){
		handlers = find_handlers(response.url);
		results = extract(handlers, response.body);
		$('#results').text(JSON.stringify(results));
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


$(function(){
	$('#loading_data').hide().ajaxStart(function(){
				$(this).show();
	}).ajaxStop(function(){
				$(this).hide();
	});
});


