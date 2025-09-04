sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/core/BusyIndicator",
  "sap/ui/core/Messaging"
], (Controller, MessageBox, BusyIndicator, Messaging) => {
  "use strict";
  let oResourceModel;                          
  return Controller.extend("logrffreightordertofreightunitsui5.controller.FreightUnitAssign", {
    onInit() {
      oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    onPressAssign() {
      this._fnActionCall('com.sap.gateway.srvd.zui_lo_rf_app.v0001.AssignFreightUnit(...)');
    },

    onPressUnAssign() {
      this._fnActionCall('com.sap.gateway.srvd.zui_lo_rf_app.v0001.UnassignFreightUnit(...)');
    },

    /**
    * Generic function to call OData Action
    * @param {string} sActionName - Action name
    */

    _fnActionCall(sActionName) {
      // Get Objects and Read Inputs from Screen
      const oView = this.getView();
      const oModel = oView.getModel();
      const oInpfriegtOrd = oView.byId("idFreightOrderInput");
      const oInppalletId = oView.byId("idSsccInput");
      const sInpfriegtOrd = oInpfriegtOrd.getValue();
      const sInppalletId = oInppalletId.getValue();
      const oMessageManager = Messaging;

      //Clear previous messages
      oMessageManager.removeAllMessages();

      // Set Input Default State
      oInpfriegtOrd.setValueState('None');
      oInppalletId.setValueState('None');

      // Validations
      this._validateInput(oInpfriegtOrd, sInpfriegtOrd);
      this._validateInput(oInppalletId, sInppalletId);

      // Stop if validation failed
      if (oInpfriegtOrd.getValueState() !== "None" || oInppalletId.getValueState() !== "None") {
        return;
      }

      //Call Action... 
      this._invokeAction(oModel, sActionName, sInpfriegtOrd, sInppalletId, oMessageManager);
    },
    _validateInput(oInput, sValue) {
      if (!sValue) {
        oInput.setValueState("Error");
        oInput.setValueStateText(oResourceModel.getText("MandatoryField"));
      }
    },
    _invokeAction(oModel, sActionName, sInpfriegtOrd, sInppalletId, oMessageManager) {
        const sEntityPath = `/ZP_LO_RF_APP('${sInpfriegtOrd}')`;
        try {
          // Create a context binding for the action
          const oContext = oModel.createBindingContext(sEntityPath);
          // Bind the action relative to the context with Action Parameters
          const oActionBinding = oModel.bindContext(
            sActionName,
            oContext
          );
          oActionBinding.setParameter("TRANSPORTORDER", sInpfriegtOrd);
          oActionBinding.setParameter("PALLETID", sInppalletId);
          BusyIndicator.show(0);
          oActionBinding.invoke().then(
            function () {
              const aMessages = oMessageManager.getMessageModel().getData();
              if (aMessages.length > 0) {
                MessageBox.success(aMessages[0].message);
              } else {
                MessageBox.success(oResourceModel.getText("reqProcesssuccess"));
              }
              BusyIndicator.hide();
            }.bind(this),
            function (oError) {
              const sError = oError.error.message;
              if (sError) {
                MessageBox.error(sError);
                BusyIndicator.hide();
              }
            }
          );
        } catch (oError) {
          MessageBox.error(oResourceModel.getText("errorOccurred"));
        }
    }
  });
});