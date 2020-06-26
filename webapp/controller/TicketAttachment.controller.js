sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketAttachment", {
		formatter : formatter,
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.userModel = this.getOwnerComponent().getModel("user");
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.byId("uploadCollection").bindItems({
				path : "/AttachmentSet",
				filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: this._ticket })],
				template: this.byId("uploadCollectionItem")
			});
		},
		
		onBeforeUploadStarts: function (oEvent) {
			
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			 var oModel = this.getView().getModel();

			oModel.refreshSecurityToken();

			var oHeaders = oModel.oHeaders;

			var sToken = oHeaders['x-csrf-token'];

			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
			 	name: "x-csrf-token",
			 	value: sToken
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
			
			
			var oCustomerHeaderIncidentId = new sap.m.UploadCollectionParameter({
			 	name: "incidentid",
			 	value: this._ticket
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderIncidentId);
			
			var oCustomerHeaderCreatorId = new sap.m.UploadCollectionParameter({
			 	name: "creatorid",
			 	value: this.userModel.oData.name
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderCreatorId);
			
		},
		onUploadComplete: function(oEvent){
			this.byId("uploadCollection").getModel().refresh();
		},
		
		onDeleteAttachment: function(oEvent){
			var attachmentId =oEvent.getSource().getProperty("documentId");
			this.oModel.remove("/AttachmentSet("+ attachmentId + ")", {
				success: function(oData){
					
				}, 
				error: function(oData){
					
				}
			});
		}
	});
});