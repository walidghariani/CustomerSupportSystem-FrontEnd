sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketsList", {
		onInit: function () {
			
			var oModel = this.getOwnerComponent().getModel("myModels");
			this.getView().setModel(oModel);
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		
		onListRowSelect: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				productPath = oEvent.getParameter("rowContext").getPath(),
				
				product = productPath.match(/'([^']+)'/)[1];
				
			this.oRouter.navTo("detail", {layout: oNextUIState.layout, product: product});
		}
	});
}, true);
