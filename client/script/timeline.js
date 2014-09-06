
$( document ).ready( function() {


	// input size change
	// (wrong info) http://hobbiez.tistory.com/321
	// http://stackoverflow.com/questions/426258/how-do-i-check-a-checkbox-with-jquery
	$('input#nav_write').prop('checked', false);
	$('input#nav_write').change( 
		function() {
			if ($( this ).is(':checked')) {
				$('div#inputArea').css('top', ($('div#nav').outerHeight() + 'px')  );
				var sendbox = $('div#inputArea textarea');
				sendbox.focus();
				sendbox.select();
				
				$('div#timeline_container').css('margin-top', '150px' );
			}
			else {
				$('div#inputArea').css('top', '-150px');
				var sendbox = $('div#inputArea textarea');
				sendbox.blur();
				$('div#timeline_container').css('margin-top', '0');
			}
		}
	);
	
	// input
	//http://stackoverflow.com/questions/8795283/jquery-get-input-value-after-keypress
	$( document ).keyup( function(ev) {
		var evKey = ev.which;
		// keycode list http://blog.outsider.ne.kr/322
		
		// n : 새 글 작성
		switch (evKey) {
			case 78 : {
				if ( !($('input#nav_write').is(':checked'))  ) {
					// set checked
					$('input#nav_write').prop('checked', true);
					$('input#nav_write').trigger('change');
				}
			} break;
		
			// esc
			case 27 : {
				// escape input box
				if ( ($('input#nav_write').is(':checked'))  ) {
					console.log('out');
					$('input#nav_write').prop('checked', false);
					$('input#nav_write').trigger('change');
				}
			} break;
		}
	});
});