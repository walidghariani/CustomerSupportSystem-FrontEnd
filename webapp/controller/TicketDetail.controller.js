sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");

			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
		},
		
		handleItemPress: function (oEvent) {
			var supplierPath = oEvent.getSource().getBindingContext().getPath(),
				customer = supplierPath.match(/'([^']+)'/)[1];

			this.oRouter.navTo("customerdetail", {ticket: this._ticket, customer: customer});
		},
		
		handleFullScreen: function (oEvent) {
			this.settingsModel.setProperty("/layout", "MidColumnFullScreen");
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", null);
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", true);
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleExitFullScreen: function (oEvent) {
			this.settingsModel.setProperty("/layout", "TwoColumnsMidExpanded");
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", true);
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", null);
			this.settingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleClose: function (oEvent) {
			this.settingsModel.setProperty("/layout", "OneColumn");
			this.oRouter.navTo("ticketslist");
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/ProductSet('" + this._ticket + "')"
			});
			
			var objectPageLayout = this.byId("ObjectPageLayout");
			var overview = this.byId("overview");
			objectPageLayout.setSelectedSection(overview);
		}
	});
}, true);
