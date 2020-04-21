sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover"
], function (Controller, JSONModel, Popover) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.ToolPage", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.layoutSettingsModel = this.getOwnerComponent().getModel("layoutSettingsModel");
			
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
		
		onAccountIconPress: function(event){
			var oPopover = new Popover({
				showHeader: true,
				placement: "Bottom",
				contentMinWidth: "200px",
				title: "Walid Ghariani",
				content: [
					new sap.m.Button({
						text: 'Recent activities',
						type: "Transparent",
						icon: "sap-icon://customer-history"
					}),
					new sap.m.Button({
						text: 'Frequently used',
						type: "Transparent",
						icon: "sap-icon://activity-individual"
					}),
					new sap.m.Button({
						text: 'App finder',
						type: "Transparent",
						icon: "sap-icon://display"
					}),
					new sap.m.Button({
						text: 'Settings',
						type: "Transparent",
						icon: "sap-icon://action-settings"
					}),
					new sap.m.Button({
						text: 'Contact support',
						type: "Transparent",
						icon: "sap-icon://email"
					}),
					new sap.m.Button({
						text: 'About',
						type: "Transparent",
						icon: "sap-icon://hint"
					}),
					new sap.m.Button({
						text: 'Sign out',
						type: "Reject",
						icon: "sap-icon://log"
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
			
			oPopover.openBy(event.getSource());
		},
		
		handleNotificationIconPress: function(oEvent){
			var oButton = oEvent.getSource();
			if (!this._oPopover){
				var mSettings = {
					contentMinWidth: "400px",
					placement: "Bottom",
					showArrow: false,
					showHeader: true,
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
			
			else if(sRouteName === "customerdetail" || sRouteName === "systemdetail" || sRouteName === "developerdetail")
				oNextUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getNextUIState(2);
				
			this.layoutSettingsModel.setProperty("/layout", oNextUIState.layout);
			
			var oUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getCurrentUIState();
			this.layoutSettingsModel.setData(oUIState);
		},
		
		onStateChanged: function (oEvent) {
			var oUIState = this.getOwnerComponent().getFlexibleColumnLayoutHelper().getCurrentUIState();
			this.layoutSettingsModel.setData(oUIState);
		},
		
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});