sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover"
], function (Controller, JSONModel, Popover) {
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
		
		onAccountIconPress: function(){
			
		},
		
		handleNotificationIconPress: function(oEvent){
			var oButton = oEvent.getSource();
			if (!this._oPopover){
				var mSettings = {
					contentMinWidth: "400px",
					placement: "Bottom",
					showArrow: false,
					showHeader: false,
					title: "Notification Center",
					content : [
						new sap.ui.core.mvc.XMLView({
							viewName : "focus.customersupportsystem.CustomerSupportSystem.view.NotificationCenter"
						})
					]
				};
				this._oPopover = new Popover(mSettings);
			}
			
			if (this._oPopover.isOpen())
				this._oPopover.close();
			else	
				this._oPopover.openBy(oButton);
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			
			var oNextUIState;
			
			if(sRouteName === "ticketslist" || sRouteName === "addticket")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(0);
				
			else if(sRouteName === "ticketdetail")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(1);
			
			else if(sRouteName === "customerdetail")
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