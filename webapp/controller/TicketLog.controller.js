sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller,formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketLog", {
		formatter:formatter,
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.byId("actionLogTable").bindItems({
				path : "/ActionSet",
				filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: this._ticket })],
				template: this.byId("listColumns")
			});
		},
	});
});