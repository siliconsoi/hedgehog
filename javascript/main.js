(function($){

	var processing;

	$('#loading_data').hide().ajaxStart(function(){
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
	});

	$('#results').orderable().results();
	processing = url_processing.init();
	persistence.init();
	render_project();

	function render_project() {
		if( !HH.project ) { return; }
		$.each(HH.project, function(idx, result){
			processing.append_result(result, 'append');
		});
	}

}(jQuery));
