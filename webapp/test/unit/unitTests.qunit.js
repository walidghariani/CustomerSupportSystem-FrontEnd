/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"focus/customersupportsystem/CustomerSupportSystem/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});