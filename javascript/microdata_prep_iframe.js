(function(){

	var scr = document.createElement(script);
	scr.src = '/javascript/jquery-1.9.0.js';
	document.getElementsByTagName('body')[0].appendChild(scr);

	var foo = jQuery.noconflict();

	scr = document.createElement(script);
	scr.src = '/javascript/jquery.microdata.js';
	document.getElementsByTagName('body')[0].appendChild(scr);

	scr = document.createElement(script);
	scr.src = '/javascript/jquery.microdata.json.js';
	document.getElementsByTagName('body')[0].appendChild(scr);

	document.HH_MICRO_DATA = foo.microdata.json();

}());
