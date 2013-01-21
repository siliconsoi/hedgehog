(function($){

	$('#results').on('click', '.move_up', move_up);
	$('#results').on('click', '.move_down', move_down);

	function move_up(evt){
		evt.preventDefault();
		$result = $(evt.currentTarget).closest('.result');
		$result.after($result.prev());
	}

	function move_down(evt){
		evt.preventDefault();
		$result = $(evt.currentTarget).closest('.result');
		$result.before($result.next());
	}

}(jQuery));
