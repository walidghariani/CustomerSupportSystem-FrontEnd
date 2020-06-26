sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/fl/FakeLrepConnectorLocalStorage"
], function (UIComponent, JSONModel, FlexibleColumnLayoutSemanticHelper, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("focus.customersupportsystem.CustomerSupportSystem.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function
			FakeLrepConnectorLocalStorage.enableFakeConnector(sap.ui.require.toUrl("sap/ui/demo/smartControls/lrep/component-test-changes.json"));
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