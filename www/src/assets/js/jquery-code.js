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
					case "add_tea":
						loadPartial('#offcanvas_content', 'contents/add_tea');
						console.log('in case add_tea');
					break;
					case "add_attribute":
						loadPartial('#offcanvas_content', 'contents/add_attribute');
						console.log('in case add_attribute');
					break;
					case "user_settings":
						loadPartial('#offcanvas_content', 'contents/user_settings');
						console.log('in case user_settings');
					break;
					case "server_settings":
						loadPartial('#offcanvas_content', 'contents/server_settings');
						console.log('in case server_settings');
					break;
					default:
						$('#offcanvas_content').html("default no content");
						console.log('in case default');
				} 
			}
			$(ele).foundation();
			fncServerSettings();
			
			if(wsIsActive() == false) {
				wsConnect();
			}
			fncUserSettings();
			//fncTea()
			//fncRatings();
			//fncAttributes();
			
		});
		

	};
	//$('#partial_header').load('./partials/header.html');
	//$('#partial_offcanvas').load('./partials/offcanvas.html');
	 loadPartial('#partial_header', 'header');
	 loadPartial('#partial_offcanvas', 'offcanvas');

	 
	//functions:
	var wsIsActive = function wsIsActive(){
		var ws_unique_id = null;
		ws_unique_id = localStorage.getItem("ws_unique_id", ws_unique_id);
		var serverSettings = new Object();
		serverSettings = JSON.parse(localStorage.getItem("serverSettings"));
		
		if(serverSettings["server_url"] != undefined && serverSettings["server_url"] != null) {
			$.ajax({
				url: serverSettings["server_url"], 
				data: {
					action: "checkConnection",
					data: JSON.stringify( {
						ws_unique_id: ws_unique_id
					}),
				},
				success: function(result) {
					result = JSON.parse(result);
					if(result['success'] === true) {
						return true;
					}
				},
				async: false
			});
		}
		return false;
	}
	var fncServerSettings = function fncServerSettings(){
		/*The problem with asking for a key is that it means that you'll have to prompt each 
		time at startup (if you store the key, you have the same problem). This may be an OK 
		tradeoff if what you're protecting is especially sensitive.
		In general, Chrome takes the philosophy of trusting the OS to protect the user's profile where 
		this data is stored, so if you use local storage to store passwords, it's no different than what 
		Chrome is doing today with password autofill, browser history, etc.
		*/
		var serverSettings = new Object();
		serverSettings = JSON.parse(localStorage.getItem("serverSettings")); 
		$.each(serverSettings, function(key, val) {
			$('#server_settings #'+key).val(val);
		});
		
		$('#server_settings input').on("input propertychange", debounce(function(){
			var serverSettings = new Object();
			$('#server_settings input').each(function() {
				serverSettings[$(this).attr("id")] = $(this).val();
			});
			localStorage.removeItem("serverSettings");
			localStorage.setItem("serverSettings", JSON.stringify(serverSettings));
			var serverSettingsNew = JSON.parse(localStorage.getItem("serverSettings"));

		},500));
		
		$('#server_settings #connect').click(function() {
			wsConnect();
		});
		
		return true;
	}
	var wsConnect = function wsConnect() {
		var serverSettings = new Object();
			serverSettings = JSON.parse(localStorage.getItem("serverSettings"));
			//Webservice create Connection
			// url: "http://www.fabelastisch.de/TeeWorkOneServer/interface.php",
									//email: "mptrace@googlemail.com",
						//password: "TeeWorkOne",

			$.ajax({
				url: serverSettings["server_url"], 
				data: {
					action: "connect",
					data: JSON.stringify( {
						email: serverSettings["server_user"],
						password: serverSettings["server_password"],
					}),
				},
				success: function(result) {
					//console.log(result);
					result = JSON.parse(result);
					ws_unique_id = result['data'];
					localStorage.setItem("ws_unique_id", ws_unique_id);
					//alert("Connection up: "+ws_unique_id);
				},
				async: false
			});
	}
	
	var fncUserSettings = function fncUserSettings(){
		var serverSettings = new Object();
		serverSettings = JSON.parse(localStorage.getItem("serverSettings"));
		var userSettings = new Object();
		userSettings = JSON.parse(localStorage.getItem("userSettings")); 
		// load data into inputs
		$.each(userSettings, function(key, val) {
			$('#user_login_data #'+key).val(val);
		});
		//set login data
		$('#user_login_data input').on("input propertychange", debounce(function(){
			var userSettings = new Object();
			$('#user_login_data input').each(function() {
				userSettings[$(this).attr("id")] = $(this).val();
			});
			localStorage.removeItem("userSettings");
			localStorage.setItem("userSettings", JSON.stringify(userSettings));
			var userSettingsNew = JSON.parse(localStorage.getItem("userSettings"));

		},500));
		//test login
		$('#user_login_data #test_login').click(function() {
			$.ajax({
				url: serverSettings["server_url"], 
				data: {
					action: "login",
					unique_id: localStorage.getItem("ws_unique_id", ws_unique_id),
					data: localStorage.getItem("userSettings"),
				},
				success: function(result) {
					var res = JSON.parse(result);
					console.log(res);
					if(res['success'] == 0) {
						alert(res['data']);
					} else {
						alert("login successfull");
					}
				},
				async: false
			});
		});
		
		//register new user 
		$('#user_register_data #register_submit').click(function(){
			var registerSettings = new Object();
			$('#user_register_data input').each(function() {
				registerSettings[$(this).attr("id")] = $(this).val();
			
			});
			
			$.ajax({
				url: serverSettings["server_url"], 
				data: {
					action: "addUser",
					unique_id: localStorage.getItem("ws_unique_id", ws_unique_id),
					data: JSON.stringify(registerSettings),
				},
				success: function(result) {
					var res = JSON.parse(result);
					console.log(res);
					if(res['success'] == 0) {
						alert(res['data']);
					}
				},
				async: false
			});
		});
	}
	
	

	console.info("jquery-code.js done");
});