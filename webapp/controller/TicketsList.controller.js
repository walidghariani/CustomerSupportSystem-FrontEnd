sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketsList", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			var model = this.getOwnerComponent().getModel("myModels");
			
			this.getView().setModel(model);
		},
		
		onListRowSelect: function (oEvent) {
			var productPath = oEvent.getParameter("rowContext").getPath(),
			ticket = productPath.match(/'([^']+)'/)[1];
			
			this.oRouter.navTo("ticketdetail", {ticket: ticket});
		}
	});
}, true);
