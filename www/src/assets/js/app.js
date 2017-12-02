import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

var createTable = function(data) {
	console.log(data[0].updated_at);
	var firstRow = data[0];

	var result = "<div class='table-scroll'><table>"; 
	for(var key in firstRow) {
		result += "<th>"+key+"</th>";
	}

	$.each(data, function(id, row) { 
		result += "<tr>";
		for(var key in row) {
			result += "<td>"+row[key]+"</td>";
		}
		result += "</tr>";
	});
	result += "</table></div>";
	
	return result;
};

$.ajax({
		url: "https://tee.fabelastisch.de/TeeWorkOneServer/interface.php",
		data: {
			action: "getRatings",
			data: JSON.stringify( {
			}),
		},

		//username: USERNAME,
		//password: PASSWORD,
		success: function(result) {
			var result = JSON.parse(result);
			var data = JSON.parse(result.data);
			var table = createTable(data);
			
			$("#ajaxListRatings").html(table);
		},
		async: false
});