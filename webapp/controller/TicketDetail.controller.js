sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (JSONModel, Controller, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketDetail", {
		
		formatter:formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.layoutSettingsModel = this.getOwnerComponent().getModel("layoutSettingsModel");
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			
			this.oRouter.attachRouteMatched(this._onRouteMatched, this);
		},
		
		handleCustomerLinkPress: function (oEvent) {
			var customer = oEvent.getSource().data("CustomerId");

			this.oRouter.navTo("customerdetail", {ticket: this._ticket, customer: customer});
		},
		
		handleSystemLinkPress: function (oEvent) {
			var system = oEvent.getSource().data("SystemId");

			this.oRouter.navTo("systemdetail", {ticket: this._ticket, system: system});
		},
		
		handleDeveloperLinkPress: function (oEvent) {
			var developer = oEvent.getSource().data("ProcessorId");
			
			this.oRouter.navTo("developerdetail", {ticket: this._ticket, developer: developer});
		},
		
		handleFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "MidColumnFullScreen");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleExitFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "TwoColumnsMidExpanded");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleClose: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "OneColumn");
			this.oRouter.navTo("ticketslist");
		},
		
		onEdit: function (oEvent){
			this.settingsModel.setProperty("/editmode" , true);
		},
		
		onCancel: function (oEvent){
			this.settingsModel.setProperty("/editmode" , false);
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , false);
		},
		
		_onRouteMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/IncidentSet(" + this._ticket + ")",
				parameters: {
			        expand: "ToCustomer,ToSystem,ToProcessor,ToPriority,ToStatus"
			    }
			});
			
			var objectPageLayout = this.byId("ObjectPageLayout");
			var overview = this.byId("overview");
			objectPageLayout.setSelectedSection(overview);
		}
	});
}, true);
