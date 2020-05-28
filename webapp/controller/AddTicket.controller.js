sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/json/JSONModel',
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog"
], function (Controller, Filter, FilterOperator,JSONModel,ValueHelpDialog) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.AddTicket", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			
			this.byId("description").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("component").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("systemId").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("mainImpact").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "addticket")
				this.oModel.setProperty("/layout", "OneColumn");
		},
		
		handleSubmit: function(oEvent){
			if ( this.verifForm() === false )
				return;
			var incident = {
				"IncidentId" : 0,
			    "IncidentType" : "I",
			    "ReporterId" : "C5305377",
			    "Description" : this.byId("description").getValue(),
			    "StatusId" : parseInt(this.byId("statusId").getSelectedKey(),10),
			    "PriorityId" : parseInt(this.byId("priorityId").getSelectedKey(),10),
			    "Component" : this.byId("component").getValue(),
			    "SystemId" : this.byId("systemId").getValue(),
			    "ErrorCategoryId1" : this.byId("comboboxErrorCategory1").getSelectedKey(),
			    "ErrorCategoryId2" : this.byId("comboboxErrorCategory2").getSelectedKey(),
			    "ProcessorId" : this.byId("processorId").getSelectedKey()
			};
			
			var that = this;
			
			this.oModel.create("/IncidentSet", incident,{
				success: function(oData, oResponse){
					that.oRouter.navTo("ticketdetail", {ticket: oData.IncidentId});
					sap.m.MessageToast.show("Your incident is added successfully");
					that.resetform();
				},
				error: function(err, oResponse){
					sap.m.MessageToast.show("Error while creating your incident");
				}
				
			});
			
		},
		
		resetform: function(){
			this.byId("description").setValue("");
			this.byId("component").setValue("");
			this.byId("systemId").setValue("");
			this.byId("mainImpact").setSelectedKey(undefined);
			this.byId("statusId").setSelectedKey(undefined);
			this.byId("priorityId").setSelectedKey(undefined);
			
		},
		
		onsapfocusleave: function(oEvent){
			if (oEvent.srcControl.getValue() === "")
				oEvent.srcControl.setValueState("Error");
			else 
				oEvent.srcControl.setValueState("None");
		},
		
		onLiveChange: function(oEvent){
			if (oEvent.getParameter("value") === "")
				oEvent.getSource().setValueState("Error");
			else
				oEvent.getSource().setValueState("None");
		},
		
		verifForm: function(){
			if(this.byId("description").getValue() === ""){
				this.byId("description").setValueState("Error");
				this.byId("description").focus();
				return false;
			}
			else if	(this.byId("component").getValue() === ""){
				this.byId("component").setValueState("Error");
				this.byId("component").focus();
				return false;
			}
			else if	(this.byId("systemId").getValue() === ""){
				this.byId("systemId").setValueState("Error");
				this.byId("systemId").focus();
				return false;
			}
			else if	(this.byId("mainImpact").getValue() === ""){
				this.byId("mainImpact").setValueState("Error");
				this.byId("mainImpact").focus();
				return false;
			}
			else 
				return true;
		},
		
		errorCategory1Change:function(oEvent){
			
			var idErrorCategory1 = oEvent.getSource().getProperty("selectedKey");
			var comboboxErrorCategory2 = this.byId("comboboxErrorCategory2");
			var itemErrorCategory2 = this.byId("itemErrorCategory2");
			
			comboboxErrorCategory2.setSelectedKey(undefined);
			
			if(idErrorCategory1 === "0"){
				comboboxErrorCategory2.setEnabled(false);
				comboboxErrorCategory2.unbindItems();
			}
			else {
				comboboxErrorCategory2.setEnabled(true);
				comboboxErrorCategory2.bindItems({
					path:"/ErrorCategorySet",
					template: itemErrorCategory2,
					templateShareable: true,
					filters: [new Filter({path:"ParentId", operator: FilterOperator.EQ , value1: idErrorCategory1 })]
				});
			}
		},
		
		handleValueHelpProcessor: function(){
			var that = this;
			if(!this._oValueHelpDialogProcessor){
				this._oValueHelpDialogProcessor = new ValueHelpDialog("valhelpdialProcessor",{
					supportMultiselect: true,
					key:"ProcessorId",
					title:"Processors' List",
					descriptionKey:"Name",
					cancel: function(){
						this.close();
					},
					ok: function(oEvent){
						var aTokens = oEvent.getParameter("tokens");
						that.byId("processorId").setSelectedKey(aTokens[0].getKey());
						this.close();
					},
					afterClose: function(){
						this.setTokens([]);
					}
				});
			}
			
			var oColModel = new JSONModel();
			oColModel.setData({
				cols:[
					{label: "Processor Id", template: "ProcessorId", width:"200px"},
					{label: "Name", template: "Name"}
				]
			});
			
			var oTable = this._oValueHelpDialogProcessor.getTable();
			oTable.setModel(oColModel, "columns");
			oTable.setModel(this.oModel);
			oTable.bindRows("/ProcessorSet");
			
			oTable.setSelectionMode("Single");
			
			this._oValueHelpDialogProcessor.open();
		},
		
		handleValueHelpSystem: function(){
			var that = this;
			if(!this._oValueHelpDialogSystem){
				this._oValueHelpDialogSystem = new ValueHelpDialog("dialogSystem",{
					supportMultiselect: true,
					key:"SystemId",
					title:"Systems' List",
					cancel: function(){
						this.close();
					},
					ok: function(oEvent){
						var aTokens = oEvent.getParameter("tokens");
						that.byId("systemId").setSelectedKey(aTokens[0].getKey());
						this.close();
					},
					afterClose: function(){
						this.setTokens([]);
					}
				});
			}
			
			var oColModel = new JSONModel();
			oColModel.setData({
				cols:[
					{label: "System Id", template: "SystemId", width:"200px"},
					{label: "System Role", template: "SystemRole", width:"200px"},
					{label: "Product Version", template: "ProductVersion", width:"200px"},
					{label: "Installation", template: "Installation", width:"200px"},
					{label: "Operating System", template: "OperatingSystem", width:"200px"}
				]
			});
			
			var oTable = this._oValueHelpDialogSystem.getTable();
			oTable.setModel(oColModel, "columns");
			oTable.setModel(this.oModel);
			oTable.bindRows("/SystemSet");
			
			oTable.setSelectionMode("Single");
			
			this._oValueHelpDialogSystem.open();
		}
		
	});
});