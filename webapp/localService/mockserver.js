sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";

	return {

		init: function() {
			// mock the service call from manifest.json
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/ZINCIDENT_MANAGER_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 500
			});

			// simulate
			var sPath = sap.ui.require.toUrl("focus/customersupportsystem/CustomerSupportSystem/localService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();
		}
	};

});
