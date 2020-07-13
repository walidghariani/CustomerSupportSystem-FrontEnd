sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/core/Fragment"
], function (JSONModel, Controller, formatter, Fragment ) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketDetail", {
		
		formatter:formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.layoutSettingsModel = this.getOwnerComponent().getModel("layoutSettingsModel");
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			this.oHashChanger = this.oRouter.getHashChanger();
			
			this.oRouter.attachRouteMatched(this._onRouteMatched, this);
			
			this.settingsModel.setProperty("/bEditMode" , false);
			
			this.oHashChanger.attachEvent("hashChanged", this.onHashChange, this);
		},
		
		handleCustomerLinkPress: function (oEvent) {
			var customer = oEvent.getSource().data("CustomerId");

			this.oRouter.navTo("customerdetail", {ticket: this._ticket, customer: customer});
		},
		
		handleSystemLinkPress: function (oEvent) {
			var system = oEvent.getSource().data("SystemId");

			this.oRouter.navTo("systemdetail", {ticket: this._ticket, system: system});
		},
		
		handleDeveloperLinkPress: function (oEvent) {
			var developer = oEvent.getSource().data("ProcessorId");
			
			this.oRouter.navTo("developerdetail", {ticket: this._ticket, developer: developer});
		},
		
		handleFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "MidColumnFullScreen");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleExitFullScreen: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "TwoColumnsMidExpanded");
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", true);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/exitFullScreen", null);
			this.layoutSettingsModel.setProperty("/actionButtonsInfo/midColumn/closeColumn", true);
		},
		
		handleClose: function (oEvent) {
			this.layoutSettingsModel.setProperty("/layout", "OneColumn");
			this.oRouter.navTo("ticketslist");
		},
		
		onEdit: function (oEvent){
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("buttonsEvents", "editpressed");
			
			this.settingsModel.setProperty("/bValidSummary" , true);
			this.settingsModel.setProperty("/bValidSolution" , true);
			this.settingsModel.setProperty("/bValidCommunication" , true);
			
			this.settingsModel.setProperty("/bEditMode" , true);
			this.oRouter.stop();
		},
		
		onCancel: function (oEvent){
			this.getOwnerComponent().getModel().resetChanges();
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("buttonsEvents", "cancelpressed");
			
			this.getView().getModel().updateBindings(true);
			
			this.settingsModel.setProperty("/bEditMode" , false);
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , false);
			
			this.oRouter.initialize(true);
		},
		
		onSave: function (oEvent){
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("buttonsEvents", "savepressed");
			
			if( this.settingsModel.getProperty("/bValidSummary") === false ){
				sap.m.MessageToast.show("Please check overview form");
			}else if( this.settingsModel.getProperty("/bValidCommunication") === false ){
				sap.m.MessageToast.show("Please check communication tab");
			}else if( this.settingsModel.getProperty("/bValidSolution") === false ){
				sap.m.MessageToast.show("Please check solution tab");
			}
			else{
				this.settingsModel.setProperty("/bEditMode" , false);
				this.settingsModel.setProperty("/bMessageTypeClicked" , false);
			}
		},
		
		_onRouteMatched: function (oEvent) {
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.getView().bindElement({
				path: "/IncidentSet(" + this._ticket + ")",
				parameters: {
			        expand: "ToCustomer,ToSystem,ToProcessor,ToPriority,ToStatus,ToReporter"
			    }
			});
			
			var objectPageLayout = this.byId("ObjectPageLayout");
			var overview = this.byId("overview");
			objectPageLayout.setSelectedSection(overview);
		},
		
		onHashChange: function(oEvent){
			this.oldHash = oEvent.getParameter("oldHash");
			this.newHash = oEvent.getParameter("newHash");
			if(this.settingsModel.getProperty("/bEditMode") === true ){
				
				var oView = this.getView();
				if (!this.byId("confirmDialog")) {
					Fragment.load({
						id: oView.getId(),
						name: "focus.customersupportsystem.CustomerSupportSystem.view.ConfirmDialog",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("confirmDialog").open();
				}
				
			}
		},
		
		onDialogOkButtonPress: function(oEvent){
			this.oHashChanger.replaceHash(this.oldHash);
			this.byId("confirmDialog").close();
		}
		
	});
}, true);
