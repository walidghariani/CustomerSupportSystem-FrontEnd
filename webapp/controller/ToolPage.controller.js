sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.ToolPage", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},
		
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.oRouter.navTo(oItem.getKey());
		},
		
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		
		onBeforeRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "ticketslist")
				this.oModel.setProperty("/layout", "OneColumn");
				
			else if(sRouteName === "ticketdetail")
				this.oModel.setProperty("/layout", "TwoColumnsMidExpanded");
			
			else if(sRouteName === "companydetail")
				this.oModel.setProperty("/layout", "ThreeColumnsMidExpanded");
		},
		
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}

	});
});