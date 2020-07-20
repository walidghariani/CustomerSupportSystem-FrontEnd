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
			//this.initDunningRunFeed();
		},
		
		initDunningRunFeed: function() {
			var that = this ;
			var hostLocation = window.location, socket, socketHostURI, webSocketURI , backenduri;
			
			backenduri = "wss://ldciofd.mo.sap.corp:44378"
			if (hostLocation.protocol === "https:") 
				socketHostURI ="wss:"; 
			else
				socketHostURI = "ws:";
				
			socketHostURI += "//" + hostLocation.host;
			
			webSocketURI = backenduri + "/sap/bc/apc/sap/zapc_test" ;
			socket = new WebSocket(webSocketURI);
			
			socket.onopen = function() {
				sap.m.MessageToast.show("Websocket opened");
			};
			
			socket.onmessage = function(dunningRunFeed) {
				
				if (dunningRunFeed.data !== undefined) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageToast.show("You ve added a new user :" + dunningRunFeed.data, sap.m.MessageBox.Icon.INFORMATION, "APC Notification", [sap.m.MessageBox.Action.OK]);
					sap.m.InstanceManager.closeAllDialogs();
					that.getOwnerComponent().getModel().refresh();
					
				}
			};

			socket.onclose = function() {
				sap.m.MessageToast.show("Websocket closed");
			};
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
