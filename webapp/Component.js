sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"focus/customersupportsystem/CustomerSupportSystem/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("focus.customersupportsystem.CustomerSupportSystem.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			
			FakeLrepConnectorLocalStorage.enableFakeConnector(sap.ui.require.toUrl("focus/customersupportsystem/CustomerSupportSystem/lrep/component-test-changes.json"));
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			//this.setModel(models.createDeviceModel(), "device");
			var oModel = new JSONModel();
			this.setModel(oModel);
		},
		
		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: oParams.get("initial"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		},
		
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});