sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSolution", {
		
		formatter:formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.oSettingsModel = this.getOwnerComponent().getModel("settingsModel");
			this.userModel = this.getOwnerComponent().getModel("user");
			
			this.oRouter.attachRouteMatched(this._onRouteMatched, this);
			
			var bus = this.getOwnerComponent().getEventBus();
			
			bus.subscribe("buttonsEvents", "editpressed", this.onEdit, this);
			
			bus.subscribe("buttonsEvents", "savepressed", this.onSave, this);
			
			bus.subscribe("buttonsEvents", "cancelpressed", this.onCancel, this);
		},
		
		_onRouteMatched: function(oEvent){
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
		/*	this.byId("solutionsTable").bindRows({
				path: "/SolutionSet",
				filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: this._ticket })]
			});
		*/	
			this.byId("mTable").bindItems({
				path: "/SolutionSet",
				filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: this._ticket })],
				template : this.byId("mTemplate"),
				templateShareable : true
			});
		},
		
		onCancel: function(){
			this.columnListItemNewLine.destroyCells();
			this.columnListItemNewLine.removeAllCells();
			this.columnListItemNewLine.destroy();
			this.columnListItemNewLine = null;
		},
		
		onEdit: function(){
			if(!this.columnListItemNewLine){
				this.columnListItemNewLine = new sap.m.ColumnListItem( "NewLine", {
					cells: [
						new sap.m.Input("NewSolutionId",{ type: "Number" , value :"" }),
						new sap.m.Input("NewDescription",{ type: "Text" , value :"" }),
						new sap.m.Input("NewStatus",{ type: "Text" , value :"" }),
						new sap.m.Input("NewCommentText",{ type: "Text" , value :"" }),
						new sap.m.Input("NewCreatedAt",{ type: "Text", value :"" , editable: false })
					]
				});
				this.byId("mTable").addItem(this.columnListItemNewLine);
			}
		},
		
		onSave: function(){
			
			this.verifNewLine();
			if ( this.oSettingsModel.getProperty("/bValidSummary") === false || this.oSettingsModel.getProperty("/bValidCommunication") === false || this.oSettingsModel.getProperty("/bValidSolution") === false )
				return;
			if( !this.columnListItemNewLine )
				return;
			var solution = {
				"IncidentId" : parseInt(this._ticket , 10 ),
				"SolutionId" : parseInt(this.columnListItemNewLine.getCells()[0].getValue(),10),
				"Description" : this.columnListItemNewLine.getCells()[1].getValue(),
				"Status" : this.columnListItemNewLine.getCells()[2].getValue(),
				"CommentText" : this.columnListItemNewLine.getCells()[3].getValue(),
				"EditorId": this.userModel.oData.name,
				"EditorName": this.userModel.oData.displayName,
				
			};
			var that = this;
			
			this.oModel.create("/SolutionSet", solution,{
				success: function(oData, oResponse){
					that.columnListItemNewLine.destroyCells();
					that.columnListItemNewLine.removeAllCells();
					that.columnListItemNewLine.destroy();
					that.columnListItemNewLine = null;
					sap.m.MessageToast.show("Your solution is added");
					that.byId("mTable").getBinding("items").refresh();
				},
				error: function(err, oResponse){
					sap.m.MessageToast.show("Error while adding solution");
				}
			});
		},
		
		verifNewLine: function(){
			if(this.columnListItemNewLine.getCells()[0].getValue() === "" && this.columnListItemNewLine.getCells()[1].getValue() === "" && this.columnListItemNewLine.getCells()[2].getValue() === "" && this.columnListItemNewLine.getCells()[3].getValue() === "" ){
				this.oSettingsModel.setProperty("/bValidSolution" , true);
				this.columnListItemNewLine.destroyCells();
				this.columnListItemNewLine.removeAllCells();
				this.columnListItemNewLine.destroy();
				this.columnListItemNewLine = null;
			}
			else if(this.columnListItemNewLine.getCells()[0].getValue() === "" || this.columnListItemNewLine.getCells()[1].getValue() === "" || this.columnListItemNewLine.getCells()[2].getValue() === "" || this.columnListItemNewLine.getCells()[3].getValue() === "" ){
				this.oSettingsModel.setProperty("/bValidSolution" , false);
				if(this.columnListItemNewLine.getCells()[0].getValue() === "" )
					this.columnListItemNewLine.getCells()[0].setValueState("Error");
				
				if(this.columnListItemNewLine.getCells()[1].getValue() === "" )
					this.columnListItemNewLine.getCells()[1].setValueState("Error");
				
				if(this.columnListItemNewLine.getCells()[2].getValue() === "" )
					this.columnListItemNewLine.getCells()[2].setValueState("Error");
				
				if(this.columnListItemNewLine.getCells()[3].getValue() === "" )
					this.columnListItemNewLine.getCells()[3].setValueState("Error");
			}
			else 
				this.oSettingsModel.setProperty("/bValidSolution" , true);
		}
	});
});