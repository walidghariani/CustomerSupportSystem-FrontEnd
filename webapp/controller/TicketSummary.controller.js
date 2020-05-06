sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter"
], function (Controller, Filter, FilterOperator, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketSummary", {		
		
		formatter: formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
			this.oRouter.getRoute("ticketdetail").attachPatternMatched(this._onProductMatched, this);
			
			this.oModel = this.getOwnerComponent().getModel();
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
				urlParameters: {
			        "$expand": "ToErrorCategory1"
			    },
				success: function(oData){
					that.intializeCombobox2(oData);
				}
			});
		},
		
		intializeCombobox2: function(oData){
			
			var comboboxErrorCategory2 = this.byId("comboboxErrorCategory2");
			var itemErrorCategory2 = this.byId("itemErrorCategory2");
			comboboxErrorCategory2.bindItems({
				path:"/ErrorCategorySet",
				template: itemErrorCategory2,
				templateShareable: true,
				filters: [new Filter({path:"ParentId", operator: FilterOperator.EQ , value1: oData.ToErrorCategory1.ErrorCategoryId })]
			});
		},
		
		errorCategory1Change:function(oEvent){
			
			var idErrorCategory1 = oEvent.getSource().getProperty("selectedKey");
			var comboboxErrorCategory2 = this.byId("comboboxErrorCategory2");
			var itemErrorCategory2 = this.byId("itemErrorCategory2");
			
			comboboxErrorCategory2.setSelectedKey(undefined);
			
			comboboxErrorCategory2.bindItems({
				path:"/ErrorCategorySet",
				template: itemErrorCategory2,
				templateShareable: true,
				filters: [new Filter({path:"ParentId", operator: FilterOperator.EQ , value1: idErrorCategory1 })]
			});
		}
	});
});