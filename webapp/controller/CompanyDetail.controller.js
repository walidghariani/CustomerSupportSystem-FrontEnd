sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.CompanyDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			
			this.oRouter.getRoute("companydetail").attachPatternMatched(this._onSupplierMatched, this);
		},
		
		handleFullScreen: function (oEvent) {
			this.settingsModel.setProperty("/layout", "EndColumnFullScreen");
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/fullScreen", null);
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/exitFullScreen", true);
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/closeColumn", true);
		},
		
		handleExitFullScreen: function (oEvent) {
			this.settingsModel.setProperty("/layout", "ThreeColumnsMidExpanded");
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/fullScreen", true);
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/exitFullScreen", null);
			this.settingsModel.setProperty("/actionButtonsInfo/endColumn/closeColumn", true);
		},
		
		handleClose: function (oEvent) {
			this.oRouter.navTo("ticketdetail", {ticket: this._ticket});
		},
		
		_onSupplierMatched: function (oEvent) {
			this._company = oEvent.getParameter("arguments").company || this._company || "0";
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/ProductCollectionStats/Filters/1/values/" + this._company,
				model: "products"
			});
		}
	});
}, true);
