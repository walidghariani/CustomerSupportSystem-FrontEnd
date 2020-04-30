sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketsList", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
			if (this.oRouter.getHashChanger().hash !== ""){
				this.ticketsListSmartTab = this.byId("smartTable_ResponsiveTable");
				this.ticketsListSmartTab.setProperty("enableAutoBinding",true);
			}
				
			this.getView().setModel(this.oModel);
		},
		
		onListRowSelect: function (oEvent) {
			var incidentPath = oEvent.getParameter("rowContext").getPath(),
			ticket = incidentPath.match(/(\d+)/)[0];
			
			this.oRouter.navTo("ticketdetail", {ticket: ticket});
		},
		
		formatRowHighlight: function (oValue) {
			
			switch (oValue){
				case 1 : return "Success";
				case 2 : return "Warning";
				case 3 : return "Error";
				case 4 : return  "Error";
			}
		}

	});
}, true);
