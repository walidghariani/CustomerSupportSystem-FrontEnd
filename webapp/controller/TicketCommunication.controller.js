sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketCommunication", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , false);
		},
		
		onMessageType: function (oEvent){
			var infoMessageTypeText = this.byId("infoMessageTypeText");
			infoMessageTypeText.setText(oEvent.getSource().getProperty("text"));
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , true);
		}
	});
});