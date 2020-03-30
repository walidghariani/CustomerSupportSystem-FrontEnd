sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			var model = this.getOwnerComponent().getModel("myModels");
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.getView().setModel(model);

			this.oRouter.getRoute("ticketslist").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("companydetail").attachPatternMatched(this._onProductMatched, this);
		},
		handleItemPress: function (oEvent) {
				var supplierPath = oEvent.getSource().getBindingContext().getPath(),
				company = supplierPath.match(/'([^']+)'/)[1];

			this.oRouter.navTo("companydetail", {ticket: this._ticket, company: company});
		},
		
		handleFullScreen: function (oEvent) {
			this.oModel.setProperty("/layout", "MidColumnFullScreen");
			this.oRouter.navTo("ticketdetail", {ticket: this._ticket});
		},
		
		handleExitFullScreen: function (oEvent) {
			this.oModel.setProperty("/layout", "TwoColumnsMidExpanded");
			this.oRouter.navTo("ticketdetail", {ticket: this._ticket});
		},
		
		handleClose: function (oEvent) {
			this.oModel.setProperty("/layout", "OneColumn");
			this.oRouter.navTo("ticketslist");
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/ProductSet('" + this._ticket + "')"
			});
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "ticketdetail")
				this.oModel.setProperty("/layout", "TwoColumnsMidExpanded");
		}
	});
}, true);
