var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

jQuery(document).ready(function($) {

	var loadPartial = function loadPartial(ele, partial) {
		$(ele).load('./partials/'+partial+'.html', function() {
			if(partial == 'offcanvas') {
				switch(getUrlParameter("content")){
					case "settings":
						loadPartial('#offcanvas_content', 'settings');
						console.log('in case settings');
					break;
					default:
						$('#offcanvas_content').html("default no content");
						console.log('in case default');
				} 
			}
			$(ele).foundation();
		});
		

	};
	//$('#partial_header').load('./partials/header.html');
	//$('#partial_offcanvas').load('./partials/offcanvas.html');
	 loadPartial('#partial_header', 'header');
	 loadPartial('#partial_offcanvas', 'offcanvas');
	 

	console.info("jquery-code.js done");
});