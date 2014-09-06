
$( document ).ready( function() {
	// http://hobbiez.tistory.com/321
	$('input#nav_write').attr('checked', false);
	$('input#nav_write').change( 
		function() {
			if ($( this ).is(':checked')) {
				$('div#inputArea').css('top', ($('div#nav').outerHeight() + 'px')  );
				$('div#inputArea textarea').focus();
				$('div#inputArea textarea').select();
				
				$('div#timeline_container').css('margin-top', '150px' );
			}
			else {
				$('div#inputArea').css('top', '-150px');
				$('div#timeline_container').css('margin-top', '0');
			}
		}
	);
});