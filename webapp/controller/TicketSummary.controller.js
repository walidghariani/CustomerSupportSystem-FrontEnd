sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter",
	'sap/ui/model/json/JSONModel'
], function (Controller, Filter, FilterOperator, formatter, JSONModel) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSummary", {		
		
		formatter: formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oSettingsModel = this.getOwnerComponent().getModel("settingsModel");
			
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
			
			this.oModel = this.getOwnerComponent().getModel();
			
			var bus = this.getOwnerComponent().getEventBus();
			
			bus.subscribe("buttonsEvents", "savepressed", this.onSave, this);
			
			
		},
		
		_onProductMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/IncidentSet(" + this._ticket + ")",
				parameters: {
			        expand: "ToCustomer,ToSystem,ToProcessor,ToStatus,ToPriority,ToErrorCategory1,ToErrorCategory2"
			    }
			});
			this.initializeComboboxes();
		},
		
		initializeComboboxes: function(){
			var comboboxErrorCategory1 = this.byId("comboboxErrorCategory1");
			var itemErrorCategory1 = this.byId("itemErrorCategory1");
			comboboxErrorCategory1.bindItems({
				path:"/ErrorCategorySet",
				template: itemErrorCategory1,
				templateShareable: true,
				filters: [new Filter({path:"ParentId", operator: FilterOperator.EQ , value1: 0})]
			});
			
			var that = this;
			
			this.oModel.read("/IncidentSet(" + this._ticket + ")",{
				success: function(oData){
					that.intializeCombobox2(oData);
					that.initializeIncidentType(oData);
				}
			});
			
		},
		
		initializeIncidentType: function(oData){
			var incidentType = oData.IncidentType;
			this.byId("statusId").bindItems({
				path: "/StatusSet",
				template: this.byId("templateStatus"),
				templateShareable: true,
				filters: [
					new Filter({path:"IncidentType", operator: FilterOperator.EQ , value1: "A" }),
					new Filter({path:"IncidentType", operator: FilterOperator.EQ , value1: incidentType })
				]
			});
		},
		
		intializeCombobox2: function(oData){
			var comboboxErrorCategory2 = this.byId("comboboxErrorCategory2");
			var itemErrorCategory2 = this.byId("itemErrorCategory2");
			if (!oData.ErrorCategoryId1)
				this.byId("comboboxErrorCategory2").setEnabled(false);
			else{
				this.byId("comboboxErrorCategory2").setEnabled(true);
				comboboxErrorCategory2.bindItems({
					path:"/ErrorCategorySet",
					template: itemErrorCategory2,
					templateShareable: true,
					filters: [new Filter({path:"ParentId", operator: FilterOperator.EQ , value1: oData.ErrorCategoryId1 })]
				});
			}
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
		
		onSave: function(){
			this.verifForm();
			if ( this.oSettingsModel.getProperty("/bValidSummary") === false || this.oSettingsModel.getProperty("/bValidCommunication") === false || this.oSettingsModel.getProperty("/bValidSolution") === false )
				return;
			var incident = {
			    "Title" : this.byId("title").getValue(),
			    "StatusId" : this.byId("statusId").getSelectedKey(),
			    "PriorityId" : this.byId("priorityId").getSelectedKey(),
			    "ErrorCategoryId1" : this.byId("comboboxErrorCategory1").getSelectedKey(),
			    "ErrorCategoryId2" : this.byId("comboboxErrorCategory2").getSelectedKey(),
			    "ProcessorId" : this.byId("processorId").getSelectedKey()
			};
			
			var that = this;
			
			//this.oModel.update("/IncidentSet("+ this._ticket + ")", incident ,{groupId:"incidentUpdate"});
			
			
			
			if(this.oModel.hasPendingChanges()){
				this.oModel.submitChanges({
					success: function(oData, oResponse){
						sap.m.MessageToast.show("Your incident is up-to-date");
						that.oModel.refresh();
					},
					error: function(err, oResponse){
						sap.m.MessageToast.show("Error while updating your incident");
					}
					
				});
			}
		},
		
		verifForm: function(){
			if(this.byId("title").getValue() === ""){
				this.byId("title").setValueState("Error");
				this.byId("title").focus();
				this.oSettingsModel.setProperty("/bValidSummary" , false);
			}
			else {
				this.oSettingsModel.setProperty("/bValidSummary" , true);
				return true;
			}
		},
		
		handleValueHelpProcessor: function(){
			var that = this;
			if(!this._oValueHelpDialogProcessor){
				this._oValueHelpDialogProcessor = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("vhdProcessor",{
					supportMultiselect: false,
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
		}
	});
});