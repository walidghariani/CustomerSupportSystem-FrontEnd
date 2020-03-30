sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.ToolPage", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
		},
		
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.oRouter.navTo(oItem.getKey());
		},
		
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}

	});
});