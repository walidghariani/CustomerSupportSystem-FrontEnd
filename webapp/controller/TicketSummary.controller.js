sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSummary", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			var model = this.getOwnerComponent().getModel("ODataModel");
			
			this.getView().setModel(model);
			
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/ProductSet('" + this._ticket + "')"
			});
		}
	});
});