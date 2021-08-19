const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCCompareSimplenoteLogic = require('./ui-logic.js');

describe('KVCCompareSimplenote_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('KVCCompareSimplenote', function () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCCompareSimplenote, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCCompareSimplenote, 'OLSKDecorCapped');
		});

	});

	describe('KVCCompareSimplenoteHeading', function test_KVCCompareSimplenoteHeading () {
		
		it('classes OLSKDecorTitle', function () {
			browser.assert.hasClass(KVCCompareSimplenoteHeading, 'OLSKDecorTitle');
		});

	});

	describe('KVCCompareSimplenoteTable', function test_KVCCompareSimplenoteTable () {
		
		it('classes OLSKDecorCompareTable', function () {
			browser.assert.hasClass(KVCCompareSimplenoteTable, 'OLSKDecorCompareTable');
		});

	});

	describe('KVCCompareSimplenoteTableHeadingHyperdraft', function test_KVCCompareSimplenoteTableHeadingHyperdraft () {
		
		it('sets text', function () {
			browser.assert.text(KVCCompareSimplenoteTableHeadingHyperdraft, 'Hyperdraft');
		});

	});

	describe('KVCCompareSimplenoteTableHeadingSimplenote', function test_KVCCompareSimplenoteTableHeadingSimplenote () {
		
		it('sets text', function () {
			browser.assert.text(KVCCompareSimplenoteTableHeadingSimplenote, 'Simplenote');
		});

	});

	Object.entries(KVCCompareSimplenoteLogic.KVCCompareSimplenoteFeatures()).forEach(function ([key, value], i) {

		describe('KVCCompareSimplenoteTableRowHyperdraft ' + key, function test_KVCCompareSimplenoteTableRowHyperdraft () {

			it('sets text', function () {
				browser.assert.text(`.${ key } td:nth-child(2) span`, value[0] ? '☑️' : '');
			});
			
		});

		describe('KVCCompareSimplenoteTableRowSimplenote ' + key, function test_KVCCompareSimplenoteTableRowSimplenote () {

			it('sets text', function () {
				browser.assert.text(`.${ key } td:nth-child(3) span`, value[1] ? '☑️' : '');
			});
			
		});
		
	});

	context('KVCCompareSimplenoteAction', function test_KVCCompareSimplenoteAction () {

		it('classes OLSKDecorAction', function () {
			browser.assert.hasClass(KVCCompareSimplenoteAction, 'OLSKDecorAction');
		});
		
	});

	context('KVCCompareSimplenoteActionButton', function test_KVCCompareSimplenoteActionButton () {

		it('classes OLSKDecorPress', function () {
			browser.assert.hasClass(KVCCompareSimplenoteActionButton, 'OLSKDecorPress');
		});
		
		it('classes OLSKDecorPressCall', function () {
			browser.assert.hasClass(KVCCompareSimplenoteActionButton, 'OLSKDecorPressCall');
		});
		
		it('sets href', function () {
			browser.assert.attribute(KVCCompareSimplenoteActionButton, 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
		});
	
	});

});
