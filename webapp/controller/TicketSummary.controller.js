sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSummary", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
			
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/IncidentSet(" + this._ticket + ")",
				parameters: {
			        expand: "ToCustomer,ToSystem,ToProcessor"
			    }
			});
		},
		errorCategory1Change:function(oEvent){
			var idErrorCategory1 = oEvent.getParameter("selectedItem").getProperty("key");
			var comboboxErrorCategory2 = this.byId("comboboxErrorCategory2");
			var itemErrorCategory2 = this.byId("itemErrorCategory2");
			
			comboboxErrorCategory2.bindItems({
				path : "/errorsCategories1/"+idErrorCategory1+"/errorsCategories2",
				template: itemErrorCategory2,
				templateShareable: true,
				model : "errorsCategories"
			});
		}
	});
});