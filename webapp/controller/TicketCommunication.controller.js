sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller,formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketCommunication", {
		
		formatter:formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.settingsModel = this.getOwnerComponent().getModel("settingsModel");
			this.userModel = this.getOwnerComponent().getModel("user");
			
			
			this.oRouter.attachRouteMatched(this._onRouteMatched, this);
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , false);
		},
		
		onMessageType: function (oEvent){
			var infoMessageTypeText = this.byId("infoMessageTypeText");
			infoMessageTypeText.setText(oEvent.getSource().getProperty("text"));
			
			this.settingsModel.setProperty("/bMessageTypeClicked" , true);
			
			switch (oEvent.getParameter("id")){
				case "__xmlview3--newReplyButton" :
					this.commentTypeId = 1;
					break; 
				case "__xmlview3--newInternalMemoButton" : 
					this.commentTypeId = 2;
					break; 
				case "__xmlview3--infoToCustomerButton" : 
					this.commentTypeId = 3;
					break; 
				case "__xmlview3--callFromCustomerButton" : 
					this.commentTypeId = 4;
					break; 
				case "__xmlview3--callToCustomerButton" : 
					this.commentTypeId = 5;
					break; 
				case "__xmlview3--stepsToReproduceButton" : 
					this.commentTypeId = 6;
					break; 
				case "__xmlview3--businessImpactButton" : 
					this.commentTypeId = 7;
					break; 
			}
		},
		
		_onRouteMatched: function(oEvent){
			this._ticket = oEvent.getParameter("arguments").ticket || this._ticket || "0";
			this.byId("commentsListId").bindItems({
				path: "/CommentSet",
				template: this.byId("commentTemplateId") ,
				templateShareable:true,
				filters: [ new sap.ui.model.Filter({ path : "IncidentId" , operator : "EQ" , value1: this._ticket })],
				sorter: new sap.ui.model.Sorter( "EditionDate" , true ),
				parameters: {
			        expand: "ToCommentType"
			    }
			});
		},
		
		onPost: function(oEvent){
			
			var comment = {
				"IncidentId" : parseInt(this._ticket,10),
				"EditorId" : this.userModel.oData.name ,
				"Text" : oEvent.getParameter("value"),
				"CommentTypeId" : this.commentTypeId,
				"EditionDate" : new Date()
			};
			
			var that = this;
			
			this.oModel.create("/CommentSet", comment,{
				success: function(oData, oResponse){
					sap.m.MessageToast.show("Message sent");
				},
				error: function(err, oResponse){
					sap.m.MessageToast.show("Error ! Message not sent");
				}
				
			});
		},
		
		onCommentAction: function(oEvent){
			var path = oEvent.getSource().getBindingContext().getPath();
			var commentId = path.substring(path.lastIndexOf("(") + 1, path.lastIndexOf(")") );
			
			if(oEvent.getSource().getKey() === "delete" ){
				this.oModel.remove(path,{
					success : function(oData, oResponse) {
						sap.m.MessageToast.show("Message removed");
					}
				});
			}
			else if(oEvent.getSource().getKey() === "edit"){
				
			}
		}
	});
});