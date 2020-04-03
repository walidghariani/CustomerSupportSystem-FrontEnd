sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.ToolPage", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
		},
		
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.oRouter.navTo(oItem.getKey());
		},
		
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			
			var oNextUIState;
			
			if(sRouteName === "ticketslist")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(0);
				
			else if(sRouteName === "ticketdetail")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(1);
			
			else if(sRouteName === "companydetail")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(2);
				
			this.settingsModel.setProperty("/layout", oNextUIState.layout);
			
			var oUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getCurrentUIState();
			this.settingsModel.setData(oUIState);
		},
		
		onStateChanged: function (oEvent) {
			var oUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getCurrentUIState();
			this.settingsModel.setData(oUIState);
		},
		
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});