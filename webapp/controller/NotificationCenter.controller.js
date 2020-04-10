sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.NotificationCenter", {
		onInit: function () {
			this.notificationsList = this.byId("notificationsList");
			var model = new sap.ui.model.json.JSONModel({
				"notifications":[
					{
						authorName:"Walid Ghariani",
						datetime:"12 mars 2020",
						description:"This ticked was assigned to you by Kholoud Daghesni",
						highlightText:"walid",
						priority: "Low",
						title : "Ticket 1 assignment",
						unread : true,
						highlight:"Error"
					},
					{
						authorName:"Walid Ghariani",
						datetime:"12 mars 2020",
						description:"This ticked was assigned to you by Kholoud Daghesni",
						highlightText:"walid",
						priority: "High",
						title : "Ticket 1 assignment",
						unread : false,
						highlight:"Error"
					}
				]
			});
			
			this.getView().setModel(model);
		}
	});
});