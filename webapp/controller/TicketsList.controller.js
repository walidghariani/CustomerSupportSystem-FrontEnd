sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (JSONModel, Controller, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketsList", {
		
		formatter: formatter,
		
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
		
		onBeforeRebind: function(oEvent) { 
			var mBindingParams = oEvent.getParameter("bindingParams");
			mBindingParams.parameters["expand"] = "ToCustomer,ToSystem,ToProcessor,ToStatus,ToReporter,ToPriority,ToErrorCategory1,ToErrorCategory2"; 
		}

	});
}, true);
