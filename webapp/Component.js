sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	return UIComponent.extend("focus.customersupportsystem.CustomerSupportSystem.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
		},
		
		getFlexibleColumnLayoutHelper: function(){
			var fcl = this.getRootControl().byId("fcl");
			return new FlexibleColumnLayoutSemanticHelper.getInstanceFor(fcl,{
				defaultTwoColumnLayoutType : "TwoColumnsMidExpanded",
				defaultThreeColumnLayoutType : "ThreeColumnsMidExpanded"
			});
		}
	});
});