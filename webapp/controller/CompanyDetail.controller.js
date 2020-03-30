sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.CompanyDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.oRouter.getRoute("companydetail").attachPatternMatched(this._onSupplierMatched, this);
		},
		
		handleFullScreen: function (oEvent) {
			this.oModel.setProperty("/layout", "EndColumnFullScreen");
			this.oRouter.navTo("companydetail", {ticket: this._ticket, company: this._company});
		},
		
		handleExitFullScreen: function (oEvent) {
			this.oModel.setProperty("/layout", "ThreeColumnsMidExpanded");
			this.oRouter.navTo("companydetail", {ticket: this._ticket, company: this._company});
		},
		
		handleClose: function (oEvent) {
			this.oModel.setProperty("/layout", "TwoColumnsMidExpanded");
			this.oRouter.navTo("ticketdetail", {ticket: this._ticket});
		},
		
		_onSupplierMatched: function (oEvent) {
			this._company = oEvent.getParameter("arguments").company || this._company || "0";
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/ProductCollectionStats/Filters/1/values/" + this._company,
				model: "products"
			});
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "companydetail")
				this.oModel.setProperty("/layout", "ThreeColumnsMidExpanded");
		}
	});
}, true);
