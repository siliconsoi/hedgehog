var translators = [{
	urlRegex: /.*/,
	decoder: handler(title_element)
}, {
	urlRegex: /^.+agoda.co.+$/,
	decoder: handler(agoda_hotel_name)
}, {
	urlRegex: /^.+booking.com.+$/,
	decoder: handler(booking_hotel_name)
}];

function handler(fn) {
	return function(body) {
		console.log('applying ' + fn.name);
		return $.extend({}, fn(body), {extractor: fn.name});
	};
}

function title_element(body) {
	var title  = body.match(/<title>([\s\S]*)<\/title>/i);
	return {data: {title: title[1] ? title[1].trim() : null}};
}

function agoda_hotel_name(body) {
	var itemprop =  body.match(/<h1 *itemprop="name">[\s\S]*<\/h1>/i);
	if( itemprop === null ) { return {data:{}}; }
	return {data: {hotel_name: $(itemprop[0]).text().trim()} };
}

function booking_hotel_name(body) {
	var item = body.match(/<h1 *class="item">[\s\S]*<\/h1>/);
	if( item === null ){return {data:{}}; }
	return {data: {hotel_name: $(item[0]).text().trim()} };
}

// }else if (website == 'booking') {
// 	regex = /<h1 *class="item">([\s\S]*)<\/h1>/;
// }else if (website == 'tripadvisor'){
// 	regex = /<h1 *id="HEADING" *property="v:name">([\s\S]*)<\/h1>/;
// }else {
// 	regex = /<title>([\s\S]*)<\/title>/i;
// }

// -------------------------------------------------------------------

$(function(){

	$('form').ajax_form({
		success: process_results
	});

	function process_results (response){
		handlers = find_handlers(response.url);
		details = extract(handlers, response.body);
		result = refine(details);
		$('#results').text(JSON.stringify(result));
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
		return details;
		// details is an array of objects
		// we need to return a single object
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


