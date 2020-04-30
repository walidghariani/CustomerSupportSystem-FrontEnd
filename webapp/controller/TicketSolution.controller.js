sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSolution", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			var model = new sap.ui.model.json.JSONModel({
				"solutions":[
					{
						Number:"12",
						Description:"Add-on",
						Status:"checked",
						Comment: "updated",
						CreatedAt : "22/04/2020"
					},
					{
						Number:"12",
						Description:"Add-on",
						Status:"checked",
						Comment: "updated",
						CreatedAt : "22/04/2020"
					}
				]
			});
			
			this.getView().setModel(model , "solutions");
		}
	});
});