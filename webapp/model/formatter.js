sap.ui.define([], function () {
	"use strict";
	return {
		incidentPriorityHighlight: function (oValue) {
			
			var x = parseInt(oValue, 10);
			
			switch (x){
				case 2 : return "Success";
				case 3 : return "Warning";
				case 4 : return  "Error";
			}
		},
		
		incidentStatusHighlight: function (oValue) {
			
			var x = parseInt(oValue, 10);
			
			switch (x){
				case 1 : return "Success";
				case 2 : return "Warning";
				case 3 : return "Error";
				case 4 : return  "Error";
			}
		},
		
		dateFormatter: function (oValue) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MMM d, yyyy,  h:mm aaa"});
			return oDateFormat.format(new Date(oValue));
		}
	};
});