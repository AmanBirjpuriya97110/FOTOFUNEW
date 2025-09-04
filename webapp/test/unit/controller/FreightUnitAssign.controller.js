/*global QUnit*/

sap.ui.define([
	"logrffreightordertofreightunitsui5/controller/FreightUnitAssign.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FreightUnitAssign Controller");

	QUnit.test("I should test the FreightUnitAssign controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
