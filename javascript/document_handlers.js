var translators = (function(){

	var translators = [{
		id: 'page_title',
		urlRegex: /.*/,
		decoder: handler(text_extractor(/<title[\s\S]*<\/title>/i))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+agoda.*.+$/,
		decoder: handler(text_extractor(/<h1 *itemprop="name">[\s\S]*<\/h1>/i))
	}, {
		id: 'agoda_breadcrumb',
		urlRegex: /^.+agoda.*.+$/,
		decoder: handler(breadcrumb(/<a id="[0-9a-z_]+breadcrumbLink"[\s\S]*?<\/a>/gi))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+booking.com.+$/,
		decoder: handler(text_extractor(/<h1 *class="item">[\s\S]*<\/h1>/i))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(text_extractor(/<h1 *id="HEADING" *property="v:name">[\s\S]*<\/h1>/i))
	}, {
		id: 'trip_advisor_breadcrumb',
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(breadcrumb(/<div *itemscope itemtype=.*>[\s\S]*?<\/div>/g))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+expedia.co.+\/.+$/,
		decoder: handler(text_extractor(/<h1 *id="address-hotel-name">[\s\S]*?<\/h1>/i))
	}, {
		id: 'expedia_breadcrump',
		urlRegex: /^.+expedia.co.+\/.+$/,
		decoder: handler(breadcrumb(/<span *typeof="v:Breadcrumb">[\s\S]*?<\/span>/g))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+hotels.co.+\/hotel.+$/,
		decoder: handler(text_extractor(/<h1 *class="fn org">[\s\S].*<\/h1>/i))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(text_extractor(/<span *itemprop="name">[\s\S].*<\/span>/i))
	}, {
		id: 'splendia_breadcrumb',
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(breadcrumb(/<div *itemscope itemtype=.*>[\s\S]*?<\/div>/g))
	}, {
		id: 'hotel_name',
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(text_extractor(/<h1 *class="section">[\s\S].*<\/h1>/i))
	}, {
		id: 'wotif_breadcrumb',
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(breadcrumb(/<li *class="crumb-[a-z0-9_-]+">[\s\S] +< *[a-z]+ *[^>]+>[^<]+<\/[a-z]+>[\s\S] +<\/li>/gi))
	}, {
		id: 'open_graph',
		urlRegex: /.*/,
		decoder: handler(open_graph)
	}, {
		id: 'canonical',
		urlRegex: /.*/,
		decoder: handler(canonical)
	}, {
		id: 'meta_tags',
		urlRegex: /.*/,
		decoder: handler(meta_tags)
	},{
		id: 'given_url',
		urlRegex: /.*/,
		decoder: handler(given_url)
	},{
		id: 'micro_data',
		urlRegex: /.*/,
		decoder: handler(micro_data)
	}];

	function handler(fn) {
		return function(body, context) {
			return $.extend({}, fn(body, context), {extractor: context.id});
		};
	}

	function text_extractor(regex) {
		return function (body, context) {
			var element =  body.match(regex),
				result = {data: {}};
			if( element === null ) { return {data:{}}; }
			result.data[context.id] = $(element[0]).text().trim();
			return result;
		};
	}

	function breadcrumb (regex) {
		return function(body, context) {
			var element = body.match(regex),
				result = {data: {}};
			result.data[context.id] = [];
			if( element === null ) { return {data:{}}; }
			$.each(element, function(i, e){ result.data[context.id].push($(e).text().trim()); });
			return result;
		};
	}

	function meta_tags(body, context) {
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

	function open_graph(body, context) {
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

	function canonical(body, context) {
		var canonical_url = body.match(/<link rel="canonical" href="(.+?)"/i);
		if( canonical_url === null ) { return {data: {}}; }
		return {data: {canonical_url: canonical_url[1]}};
	}

	function given_url(body, context) {
		return {data: {given_url: context.url} };
	}

	function micro_data (body, context) {
		// requires asynchronicity
		return {data: {}};
	}

	return translators;

}(jQuery));