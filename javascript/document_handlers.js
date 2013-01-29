var translators = (function(){

	var translators = [{
		urlRegex: /.*/,
		decoder: handler(text_extractor('page_title', /<title[\s\S]*<\/title>/i))
	}, {
		urlRegex: /^.+agoda.*.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *itemprop="name">[\s\S]*<\/h1>/i))
	}, {
		urlRegex: /^.+agoda.*.+$/,
		decoder: handler(agoda_breadcrumb)
	}, {
		urlRegex: /^.+booking.com.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *class="item">[\s\S]*<\/h1>/i))
	}, {
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *id="HEADING" *property="v:name">[\s\S]*<\/h1>/i))
	}, {
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(tripad_splen_breadcrumb)
	}, {
		urlRegex: /^.+expedia.co.+\/.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *id="address-hotel-name">[\s\S]*?<\/h1>/i))
	}, {
		urlRegex: /^.+expedia.co.+\/.+$/,
		decoder: handler(expedia_breadcrump)
	}, {
		urlRegex: /^.+hotels.co.+\/hotel.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *class="fn org">[\s\S].*<\/h1>/i))
	}, {
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(text_extractor('hotel_name', /<span *itemprop="name">[\s\S].*<\/span>/i))
	}, {
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(tripad_splen_breadcrumb)
	}, {
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(text_extractor('hotel_name', /<h1 *class="section">[\s\S].*<\/h1>/i))
	}, {
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(wotif_breadcrump)
	}, {
		urlRegex: /.*/,
		decoder: handler(open_graph)
	}, {
		urlRegex: /.*/,
		decoder: handler(canonical)
	}, {
		urlRegex: /.*/,
		decoder: handler(meta_tags)
	}];

	function handler(fn) {
		return function(body) {
			console.log('applying ' + fn.name);
			return $.extend({}, fn(body), {extractor: fn.name});
		};
	}

	function text_extractor(name, regex) {
		return function(body) {
			var element =  body.match(regex),
				result = {data: {}};
			if( element === null ) { return {data:{}}; }
			result.data[name] = $(element[0]).text().trim();
			return result;
		};
	}

	function meta_tags(body) {
		var data = body.match(/<meta *name="[a-z_-]+" *content=+"[^"]+" *\/>/g),
			collector = {data: {meta_tags: {}}};
		if( data === null ) { return {data: {}}; }
		for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<meta *name="([a-z_-]+)" *content=+"([^"]+)" *\/>/);
			if( temp === null ) { continue; }
			collector.data.meta_tags[temp[1]] = temp[2];
		}
		return collector;
	}

	function open_graph(body) {
		var data = body.match(/<meta *property="og:[a-z_-]+" *content=+"[^"]+" *[^\/]*\/>/g),
			collector = {data: {open_graph: {}}};
			if( data === null ) { return {data: {}}; }
		for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<meta *property="og:([a-z_-]+)" *content=+"([^"]+)" *[^\/]*\/>/);
			if( temp === null ) { continue; }
			collector.data.open_graph[temp[1]] = temp[2];
		}
		return collector;
	}

	function canonical(body) {
		var canonical_url = body.match(/<link rel="canonical" href="(.+?)"/i);
		if( canonical_url === null ) { return {data: {}}; }
		return {data: {canonical_url: canonical_url[1]}};
	}

	function agoda_breadcrumb (body) {
		var crumbs = body.match(/<a id="[0-9a-z_]+breadcrumbLink"[\s\S]*?<\/a>/gi),
			result = {data: {agoda_breadcrumb: []}};
		$.each(crumbs, function(i, e){ result.data.agoda_breadcrumb.push($(e).text()); });
		return result;
	}

	function wotif_breadcrump (body) {
		var crumbs = body.match(/<li *class="crumb-[a-z0-9_-]+">[\s\S] +< *[a-z]+ *[^>]+>[^<]+<\/[a-z]+>[\s\S] +<\/li>/gi),
			result = {data: {wotif_breadcrumb: []}};
		$.each(crumbs, function(i, e){ result.data.wotif_breadcrumb.push($(e).text().trim()); });
		return result;
	}

	function tripad_splen_breadcrumb (body) {
		var crumbs = body.match(/<div *itemscope itemtype=.*>[\s\S]*?<\/div>/g),
			result = {data: {trip_advisor_breadcrumb: []}};
		$.each(crumbs, function(i, e){ result.data.trip_advisor_breadcrumb.push($(e).text().trim()); });
		return result;
	}

	function expedia_breadcrump (body) {
		var crumbs = body.match(/<span *typeof="v:Breadcrumb">[\s\S]*?<\/span>/g),
			result = {data: {expedia_breadcrumb: []}};
		$.each(crumbs, function(i, e){ result.data.expedia_breadcrumb.push($(e).text().trim()); });
		return result;
	}

	return translators;

}(jQuery));
