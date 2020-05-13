sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.AddTicket", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINCIDENT_MANAGER_SRV");
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			sap.ui.getCore().setModel(oDataModel, "oDataModel");
			
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "addticket")
				this.oModel.setProperty("/layout", "OneColumn");
		},
		
		handleSubmit: function(oEvent){
			var oDataModel = sap.ui.getCore().getModel("oDataModel");
			
			oDataModel.setHeaders({
				"Content-type" : "application/json;odata=verbose",
				
			});
			
			var incident = {
				"IncidentId" : 0,
			    "IncidentType" : "I",
			    "ReporterId" : "C5305377",
			    "Description" : this.byId("description").getValue(),
			    "StatusId" : parseInt(this.byId("statusId").getSelectedKey(),10),
			    "PriorityId" : parseInt(this.byId("priorityId").getSelectedKey(),10),
			    "Component" : this.byId("component").getValue(),
			    "ProcessorId" : "",
			    "SystemId" : this.byId("system").getValue(),
			    "CustomerId" : ""
			};
			
			var that = this;
			
			this.getOwnerComponent().getModel().create("/IncidentSet", incident,{
				success: function(oData, oResponse){
					that.resetform();
					sap.m.MessageToast.show("Your incident ID is : " + oData.IncidentId);
				},
				error: function(err, oResponse){
					sap.m.MessageToast.show("Error while creating record..." + err);
				}
				
			});
			
		},
		
		resetform: function(){
			this.byId("statusId").setSelectedKey(undefined);
			this.byId("priorityId").setSelectedKey(undefined);
			this.byId("component").setValue("");
			this.byId("description").setValue("");
		},
		
		submitEnabled: function(){
			if (this.byId("component").getValue() === "" || this.byId("description").getValue() === "" )
				return true;
			else 
				return true;
		}
		
	});
});