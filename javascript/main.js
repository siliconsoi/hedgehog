(function($){

	render_project();
	persistence.init();
	$('#results').orderable().results();

	$('#loading_data').hide().ajaxStart(function(){
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
	});

	function render_project() {
		if( !HH.project.length ) { return; }
		$.each(HH.project, function(idx, result){ append_result(result, 'append'); });
	}

}(jQuery));
