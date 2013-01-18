
$(function(){

	$('form').ajax_form({
		success: process_results
	});

	function process_results(response){
		var hotel_name = response;
		website = ($('#input_url').val()).split('.')[1];
		regex = "";
		if (website == 'agoda') {
		   	regex = /<h1 *itemprop="name">([\s\S]*)<\/h1>/i;
		}else if (website == 'booking') {
			regex = /<h1 *class="item">([\s\S]*)<\/h1>/;
		}else if (website == 'tripadvisor'){
			regex = /<h1 *id="HEADING" *property="v:name">([\s\S]*)<\/h1>/;
		}else {
			regex = /<title>([\s\S]*)<\/title>/i;
		}

		// $('#results').append($(hotel_name.match(regex)[0]).text());
		$('#results').text($(hotel_name.match(regex)[0]).text());

		// if u wanna to get a title
		// ++++++
		// regex = /<title>([\s\S]*)<\/title>/i;
		// console.log($(input.match(regex)[0]).text());
		// ++++++

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


