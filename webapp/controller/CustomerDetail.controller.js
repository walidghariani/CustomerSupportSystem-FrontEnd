sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.CustomerDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.layoutSettingsModel = this.getOwnerComponent().getModel("layoutSettingsModel");
			
			this.oRouter.getRoute("customerdetail").attachPatternMatched(this._onSupplierMatched, this);
		},
		
		handleFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "EndColumnFullScreen");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/fullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/exitFullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/closeColumn", true);
		},
		
		handleExitFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "ThreeColumnsMidExpanded");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/fullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/exitFullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/endColumn/closeColumn", true);
		},
		
		handleClose: function (oEvent) {
			this.oRouter.navTo("ticketdetail", {ticket: this._ticket});
		},
		
		_onSupplierMatched: function (oEvent) {
			this._customer = oEvent.getParameter("arguments").customer || this._customer || "0";
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/CustomerSet('" + this._customer + "')"
			});
		}
	});
}, true);
