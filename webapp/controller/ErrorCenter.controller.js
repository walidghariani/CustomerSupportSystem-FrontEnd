sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.ErrorCenter", {
		onInit: function () {
			/*
			this.byId("errorsList").bindItems({
				model : "errorsModel",
				path : "ErrorSet", 
				template : this.byId("errorTemplate")
			});
			*/
		},
		onExit: function(){
			this.destroy();
		}
	});
});