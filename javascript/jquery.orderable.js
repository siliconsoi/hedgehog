(function($){

	$.orderable = {
		defaults: {
			up_btn: '.move_up',
			down_btn: '.move_down',
			item: '.result'
		}
	};

	$.fn.orderable = function(options) {
		var opts = $.extend({}, $.orderable.defaults, options);
		this.each(function(idx, element){ orderable($(element), opts); });
		return this;
	};

	function orderable($container, opts) {

		$container.on('click', opts.up_btn, move_up);
		$container.on('click', opts.down_btn, move_down);

		function move_up(evt){
			var $item = $(evt.currentTarget).closest(opts.item);
			evt.preventDefault();
			$item.after($item.prev());
		}

		function move_down(evt){
			var $item = $(evt.currentTarget).closest(opts.item);
			evt.preventDefault();
			$item.before($item.next());
		}

	}

}(jQuery));

