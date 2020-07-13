sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/json/JSONModel',
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"../model/formatter",
	"sap/ui/core/ws/SapPcpWebSocket",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/ws/WebSocket"
], function (Controller, Filter, FilterOperator,JSONModel,ValueHelpDialog,formatter, SapPcpWebSocket, DateFormat, WebSocket) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.CustomerTicket", {
		formatter:formatter,
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oHashChanger = this.oRouter.getHashChanger();
			this.oModel = this.getOwnerComponent().getModel();
			this.errorsModel = this.getOwnerComponent().getModel("errorsModel");
			this.userModel = this.getOwnerComponent().getModel("user");
			
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			
			this.oHashChanger.attachEvent("hashChanged", this.onHashChange, this);
			
			this.byId("title").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("component").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("systemId").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
			this.byId("customerId").addEventDelegate({ onsapfocusleave: this.onsapfocusleave });
		},
		
		onHashChange: function(oEvent){
			if(oEvent.getParameter("newHash") !== "customerticket" && oEvent.getParameter("customerticket") === "customerticket" && this.validSubmission === false){
				this.oModel.remove("/IncidentSet(" + this.IncidentId + ")");
			}
		},
		
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
			if(sRouteName === "customerticket"){
				this.oModel.setProperty("/layout", "OneColumn");
				
				
				var that = this;
			
				this.incident = {
				    "IncidentType" : "C",
				    "ReporterId" : this.userModel.oData.name
				};
				
				this.validSubmission = false;
				
				this.oModel.create("/IncidentSet", this.incident,{
					success: function(oData, oResponse){
						that.IncidentId = oData.IncidentId;
						that.byId("incidentId").setValue(that.IncidentId);
						that.byId("uploadCollection").bindItems({
							path : "/AttachmentSet",
							filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: that.IncidentId })],
							template: that.byId("uploadCollectionItem")
						});
					},
					error: function(err, oResponse){
						
					}
				});	
			}
		},
		
		handleSubmit: function(oEvent){
			if ( this.verifForm() === false )
				return;
				
			this.incident.Title = this.byId("title").getValue();
			this.incident.Description = this.byId("description").getValue();
			this.incident.StatusId = parseInt(this.byId("statusId").getSelectedKey(),10);
			this.incident.PriorityId = parseInt(this.byId("priorityId").getSelectedKey(),10);
			this.incident.Component = this.byId("component").getValue();
			this.incident.SystemId = this.byId("systemId").getValue();
			this.incident.CustomerId = this.byId("customerId").getSelectedKey();
			
			var that = this;
			
			this.oModel.update("/IncidentSet("+ this.IncidentId + ")", this.incident ,{
				success: function(oData, oResponse){
					that.validSubmission = true;
					that.oRouter.navTo("ticketdetail", {ticket: that.IncidentId});
					sap.m.MessageToast.show("Your incident is added successfully");
					that.resetform();
					
				},
				error: function(err, oResponse){
					sap.m.MessageToast.show("Error while creating your incident");
					that.errorsModel.getProperty("/ErrorSet").push({
						"subtitle" : "An error occurs while adding the incident."
					});    
				}
				
			});
			
		},
		
		resetform: function(){
			this.byId("title").setValue("");
			this.byId("description").setValue("");
			this.byId("component").setValue("");
			this.byId("systemId").setValue("");
			this.byId("customerId").setValue("");
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
			if(this.byId("title").getValue() === ""){
				this.byId("title").setValueState("Error");
				this.byId("title").focus();
				return false;
			}
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
			else if	(this.byId("customerId").getValue() === ""){
				this.byId("customerId").setValueState("Error");
				this.byId("customerId").focus();
				return false;
			}
			else if	(this.byId("systemId").getValue() === ""){
				this.byId("systemId").setValueState("Error");
				this.byId("systemId").focus();
				return false;
			}
			else 
				return true;
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
		},
		
		handleValueHelpCustomer: function(){
			var that = this;
			if(!this._oValueHelpDialogCustomer){
				this._oValueHelpDialogCustomer = new ValueHelpDialog("dialogCustomer",{
					supportMultiselect: true,
					key:"CustomerId",
					title:"Customers' List",
					cancel: function(){
						this.close();
					},
					ok: function(oEvent){
						var aTokens = oEvent.getParameter("tokens");
						that.byId("customerId").setSelectedKey(aTokens[0].getKey());
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
					{label: "Customer Id", template: "CustomerId", width:"200px"},
					{label: "Name", template: "Name", width:"200px"},
					{label: "Partner Type", template: "PartnerType", width:"200px"},
					{label: "Contact Type", template: "ContactType", width:"200px"},
					{label: "Support Partner", template: "SupportPartner", width:"200px"},
					{label: "Contact Type", template: "ServicePartner", width:"200px"}
				]
			});
			
			var oTable = this._oValueHelpDialogCustomer.getTable();
			oTable.setModel(oColModel, "columns");
			oTable.setModel(this.oModel);
			oTable.bindRows("/CustomerSet");
			
			oTable.setSelectionMode("Single");
			
			this._oValueHelpDialogCustomer.open();
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
			 	value: this.IncidentId
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderIncidentId);
			
			var oCustomerHeaderCreatorId = new sap.m.UploadCollectionParameter({
			 	name: "creatorid",
			 	value: this.incident.ReporterId
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