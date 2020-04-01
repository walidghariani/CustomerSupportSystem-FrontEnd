sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.AddTicket", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "addticket")
				this.oModel.setProperty("/layout", "OneColumn");
		}
	});
});