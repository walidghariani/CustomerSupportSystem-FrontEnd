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
			this.oModel = this.getOwnerComponent().getModel();
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
			
			var userModel = this.getOwnerComponent().getModel("user");
			if (!this.oAccPopover){
				this.oAccPopover = new Popover({
					showHeader: true,
					placement: "Bottom",
					contentMinWidth: "200px",
					title: "{user>/displayName}" ,
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
				
				this.oAccPopover.setModel(userModel , "user");
			}
			
			if(this.oAccPopover.isOpen())
				this.oAccPopover.close();
			else
				this.oAccPopover.openBy(event.getSource());
		},
		
		handleErrorIconPress: function(oEvent){
			var oMessageTemplate = new sap.m.MessageItem({
				title : "Error message" ,
				activeTitle:true,
				subtitle : "{errorsModel>subtitle}",
				type : "Error"
			}); 
			
			if (!this.oMessagePopover){
				this.oMessagePopover = new sap.m.MessagePopover({
					activeTitlePress : function (){
						
					},
					items: {
						path: '/ErrorSet',
						model : "errorsModel",
						template: oMessageTemplate
					}
				});
			}
			var errorsModel = this.getOwnerComponent().getModel("errorsModel");
			this.oMessagePopover.setModel(errorsModel , "errorsModel");
			
			if (this.oMessagePopover.isOpen())
				this.oMessagePopover.close();
			else
				this.oMessagePopover.toggle(oEvent.getSource());
		},
		
		handleNotificationIconPress: function(oEvent){
			var oButton = oEvent.getSource();
			if (!this.oNotifPopover){
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
				this.oNotifPopover = new Popover(mSettings);
			}
			
			if (this.oNotifPopover.isOpen())
				this.oNotifPopover.close();
			else	
				this.oNotifPopover.openBy(oButton);
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			
			var oNextUIState;
			
			if(sRouteName === "ticketslist" || sRouteName === "addticket" || sRouteName === "customerticket")
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
		}
	});
});