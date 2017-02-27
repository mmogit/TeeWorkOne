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

//http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
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
			
			saveServerSettings();
			
		});
		

	};
	//$('#partial_header').load('./partials/header.html');
	//$('#partial_offcanvas').load('./partials/offcanvas.html');
	 loadPartial('#partial_header', 'header');
	 loadPartial('#partial_offcanvas', 'offcanvas');

	//functions:
	//save server settings
	//first load if exists
	var serverSettings = JSON.parse(localStorage.getItem("serverSettings"));
	console.log(serverSettings);
	/*$(serverSettings).each(function(a,b) {
		console.log(a);
		console.log(b);
		console.log("#");
	});*/
	//then save on keyup
	var saveServerSettings = function saveServerSettings(){
		$('#server_settings input').keyup(debounce(function(){
			var serverSettings = new Object();
			$('#server_settings input').each(function() {
				serverSettings[$(this).attr("id")] = $(this).val();
			});
			localStorage.setItem ("serverSettings", JSON.stringify(serverSettings));
			console.log("saved");
			var serverSettings2 = JSON.parse(localStorage.getItem(serverSettings));
			console.log(serverSettings);
		},500));
	}
	
	

	console.info("jquery-code.js done");
});