sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (JSONModel, Controller, formatter) {
	"use strict";

	return Controller.extend("focus.customersupportsystem.CustomerSupportSystem.controller.TicketsList", {
		
		formatter: formatter,
		
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			
			if (this.oRouter.getHashChanger().hash !== ""){
				this.ticketsListSmartTab = this.byId("smartTable_ResponsiveTable");
				this.ticketsListSmartTab.setProperty("enableAutoBinding",true);
			}
			
			var smartfilterbar = this.byId("smartFilterBar");
			this.initDunningRunFeed();
		},
		
		initDunningRunFeed: function() {
			var that = this ;
			var hostLocation = window.location, socket, socketHostURI, webSocketURI;
			
			if (hostLocation.protocol === "https:") 
				socketHostURI ="wss:"; 
			else
				socketHostURI = "ws:";
				
			socketHostURI += "//" + hostLocation.host;
			webSocketURI = socketHostURI + "/sap/bc/apc/sap/ztest_apc" ;
			
			// var oSocket = this.oSocket = new sap.ui.core.ws.SapPcpWebSocket(webSocketURI,
			// sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10);
			
			socket = new WebSocket(webSocketURI);
			
			socket.onopen = function() {};
			
			socket.onmessage = function(dunningRunFeed) {
				
				if (dunningRunFeed.data !== undefined) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.InstanceManager.closeAllDialogs();
					that.getOwnerComponent().getModel().refresh();
					sap.m.MessageBox.show("You ve added a new user :" + dunningRunFeed.data, sap.m.MessageBox.Icon.INFORMATION, "APC Notification", [sap.m.MessageBox.Action.OK]);
				}
			};

			socket.onclose = function() {};
		},
		
		onListRowSelect: function (oEvent) {
			var incidentPath = oEvent.getParameter("rowContext").getPath(),
			ticket = incidentPath.match(/(\d+)/)[0];
			
			this.oRouter.navTo("ticketdetail", {ticket: ticket});
		},
		
		onBeforeRebind: function(oEvent) { 
			var mBindingParams = oEvent.getParameter("bindingParams");
			mBindingParams.parameters["expand"] = "ToCustomer,ToSystem,ToProcessor,ToStatus,ToReporter,ToPriority,ToErrorCategory1,ToErrorCategory2"; 
		}

	});
}, true);
