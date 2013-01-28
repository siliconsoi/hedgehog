var translators = (function(){

	var translators = [{
		urlRegex: /.*/,
		decoder: handler(title_element)
	}, {
		urlRegex: /^.+agoda.*.+$/,
		decoder: handler(text_extractor(/<h1 *itemprop="name">[\s\S]*<\/h1>/i))
	}, {
		urlRegex: /^.+booking.com.+$/,
		decoder: handler(text_extractor(/<h1 *class="item">[\s\S]*<\/h1>/i))
	}, {
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(text_extractor(/<h1 *id="HEADING" *property="v:name">[\s\S]*<\/h1>/i))
	},{
		urlRegex: /^.+tripadvisor.co.+\/Hotel_Review.+$/,
		decoder: handler(tripad_splen_breadcrumb)
	}, {
		urlRegex: /^.+expedia.co.+\/Hotel-Search.+$/,
		decoder: handler(text_extractor(/<h1 *id="address-hotel-name">[\s\S]*<\/h1>/i))
	},{
		urlRegex: /^.+expedia.co.+\/Hotel-Search.+$/,
		decoder: handler(expedia_breadcrump)
	},{
		urlRegex: /^.+hotels.co.+\/hotel.+$/,
		decoder: handler(text_extractor(/<h1 *class="fn org">[\s\S].*<\/h1>/i))
	}, {
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(text_extractor(/<span *itemprop="name">[\s\S].*<\/span>/i))
	},{
		urlRegex: /^.+splendia.com\/.+$/,
		decoder: handler(tripad_splen_breadcrumb)
	},{
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(text_extractor(/<h1 *class="section">[\s\S].*<\/h1>/i))
	},{
		urlRegex: /^.+wotif.com+\/hotel.+$/,
		decoder: handler(wotif_breadcrump)
	},{
		urlRegex: /.*/,
		decoder: handler(open_graph)
	}, {
		urlRegex: /.*/,
		decoder: handler(canonical)
	}];

	function handler(fn) {
		return function(body) {
			console.log('applying ' + fn.name);
			return $.extend({}, fn(body), {extractor: fn.name});
		};
	}

	function text_extractor(regex) {
		return function(body) {
			var element =  body.match(regex);
			if( element === null ) { return {data:{}}; }
			return {data: {hotel_name: $(element[0]).text().trim()} };
		};
	}

	function title_element(body) {
		var title  = body.match(/<title>([\s\S]*)<\/title>/i);
		return {data: {title: title[1] ? title[1].trim() : null}};
	}

	function open_graph(body) {
		var regex = (/<meta *property="og:[a-z_-]+" *content=+"[^"]+" *[^\/]+\/>/g);
		if(regex.test(body)){
			var data = body.match(regex),
			collector = [],
			hash = {};
			for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<meta *property="og:([a-z_-]+)" *content=+"([^"]+)" *[^\/]+\/>/);
			hash[temp[1]] = temp[2];
			collector.push(hash);
			}
			return collector;
		}else{
			return null;
		}
	}

	function canonical(body) {
		var regex = /<meta *name="[a-z_-]+" *content=+"[^"]+" *\/>/g;
		if(regex.test(body)){
			var data = body.match(regex),
			collector = [],
			hash = {};
			for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<meta *name="([a-z_-]+)" *content=+"([^"]+)" *\/>/);
			hash[temp[1]] = temp[2];
			collector.push(hash);
		}
			return collector;
		}else{
			return null;
		}
	}

	function tripad_splen_breadcrumb (body) {
		var data = body.match(/<div *itemscope itemtype=.*>[\s\S]*?<\/div>/g),
			collector = [],
			hash = {};
		for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<div *itemscope itemtype=.*>([\s\S]*?)<\/div>/);
			hash[temp[1]] = temp[2];
			collector.push(hash);
		}
		return collector;
	}

	function expedia_breadcrump (body) {
		var data = body.match(/<span *typeof="v:Breadcrumb">[\s\S]*?<\/span>/g),
			collector = [],
			hash = {};
		for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<span *typeof="v:Breadcrumb">([\s\S]*?)<\/span>/);
			hash[temp[1]] = temp[2];
			collector.push(hash);
		}
		return collector;
	}

	function wotif_breadcrump (body) {
		var data = body.match(/<*.crumbtrail.+ title=".+">[\s\S]*?<\/.+>/g),
			collector = [],
			hash = {};
		for (var idx=0; idx<data.length; idx++){
			hash = {};
			temp = data[idx].match(/<*.crumbtrail.+ title=".+">([\s\S]*?)<\/.+>/);
			hash[temp[1]] = temp[1];
			collector.push(hash);
		}
		return collector;
	}

	return translators;

}(jQuery));
