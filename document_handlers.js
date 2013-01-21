var translators = (function(){

	var translators = [{
		urlRegex: /.*/,
		decoder: handler(title_element)
	}, {
		urlRegex: /^.+agoda.co.+$/,
		decoder: handler(agoda_hotel_name)
	}, {
		urlRegex: /^.+booking.com.+$/,
		decoder: handler(booking_hotel_name)
	}, {
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(tripadvisor_hotel_name)
	},{
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(splendia_hotel_name)
	},{
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(wotif_hotel_name)
	}
	];

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
		var item = body.match(/<h1 *class="item">[\s\S]*<\/h1>/i);
		if( item === null ){return {data:{}}; }
		return {data: {hotel_name: $(item[0]).text().trim()} };
	}

	function tripadvisor_hotel_name(body) {
		var item_tripad = body.match(/<h1 *id="HEADING" *property="v:name">[\s\S]*<\/h1>/i);
		if ( item_tripad === null ) { return {data:{}}; }
		return {data: {hotel_name: $(item_tripad[0]).text().trim()} };
	}

	function splendia_hotel_name(body) {
		var item_splendia = body.match(/<span *itemprop="name">[\s\S].*<\/span>/i);
		if (item_splendia === null ){return {data:{}}; }
		return {data: {hotel_name: $(item_splendia[0]).text().trim()} };
	}

	function wotif_hotel_name(body) {
		var item_wotif = body.match(/<h1 *class="section">[\s\S].*<\/h1>/i);
		if (item_wotif === null ){return {data:{}}; }
		return {data: {hotel_name: $(item_wotif[0]).text().trim()} };
	}

	return translators;

}(jQuery));

