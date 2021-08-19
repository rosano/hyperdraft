const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCCompareSimplenote: '.KVCCompareSimplenote',

	KVCCompareSimplenoteHeading: '.KVCCompareSimplenoteHeading',
	
	KVCCompareSimplenoteIntro: '.KVCCompareSimplenoteIntro',
	KVCCompareSimplenoteContrast: '.KVCCompareSimplenoteContrast',

	KVCCompareSimplenoteTable: '.KVCCompareSimplenoteTable',
	KVCCompareSimplenoteTableHeadingFeature: '.KVCCompareSimplenoteTableHeadingFeature',
	KVCCompareSimplenoteTableHeadingHyperdraft: '.KVCCompareSimplenoteTableHeadingHyperdraft',
	KVCCompareSimplenoteTableHeadingSimplenote: '.KVCCompareSimplenoteTableHeadingSimplenote',
	KVCCompareSimplenoteTableRowFeature: '.KVCCompareSimplenoteTableRow td:nth-child(1)',
	KVCCompareSimplenoteTableRowHyperdraft: '.KVCCompareSimplenoteTableRow td:nth-child(2) span',
	KVCCompareSimplenoteTableRowHyperdraftCaption: '.KVCCompareSimplenoteTableRow td:nth-child(2) small',
	KVCCompareSimplenoteTableRowSimplenote: '.KVCCompareSimplenoteTableRow td:nth-child(3) span',
	KVCCompareSimplenoteTableRowSimplenoteCaption: '.KVCCompareSimplenoteTableRow td:nth-child(3) small',

	KVCCompareSimplenoteAction: '.KVCCompareSimplenoteAction',
	KVCCompareSimplenoteActionHeading: '.KVCCompareSimplenoteActionHeading',
	KVCCompareSimplenoteActionButton: '.KVCCompareSimplenoteActionButton',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCCompareSimplenote_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows KVCCompareSimplenote', function() {
		browser.assert.elements(KVCCompareSimplenote, 1);
	});

	it('shows KVCCompareSimplenoteHeading', function () {
		browser.assert.elements(KVCCompareSimplenoteHeading, 1);
	});

	it('shows KVCCompareSimplenoteIntro', function () {
		browser.assert.elements(KVCCompareSimplenoteIntro, 1);
	});

	it('shows KVCCompareSimplenoteContrast', function () {
		browser.assert.elements(KVCCompareSimplenoteContrast, 1);
	});

	it('shows KVCCompareSimplenoteTable', function () {
		browser.assert.elements(KVCCompareSimplenoteTable, 1);
	});

	it('shows KVCCompareSimplenoteTableHeadingFeature', function () {
		browser.assert.elements(KVCCompareSimplenoteTableHeadingFeature, 1);
	});

	it('shows KVCCompareSimplenoteTableHeadingHyperdraft', function () {
		browser.assert.elements(KVCCompareSimplenoteTableHeadingHyperdraft, 1);
	});

	it('shows KVCCompareSimplenoteTableHeadingSimplenote', function () {
		browser.assert.elements(KVCCompareSimplenoteTableHeadingSimplenote, 1);
	});

	it('shows KVCCompareSimplenoteTableRowFeature', function () {
		browser.assert.elements(KVCCompareSimplenoteTableRowFeature);
	});

	it('shows KVCCompareSimplenoteTableRowHyperdraft', function () {
		browser.assert.elements(KVCCompareSimplenoteTableRowHyperdraft);
	});

	it('shows KVCCompareSimplenoteTableRowHyperdraftCaption', function () {
		browser.assert.elements(KVCCompareSimplenoteTableRowHyperdraftCaption);
	});

	it('shows KVCCompareSimplenoteTableRowSimplenote', function () {
		browser.assert.elements(KVCCompareSimplenoteTableRowSimplenote);
	});

	it('shows KVCCompareSimplenoteTableRowSimplenoteCaption', function () {
		browser.assert.elements(KVCCompareSimplenoteTableRowSimplenoteCaption);
	});

	it('shows KVCCompareSimplenoteAction', function () {
		browser.assert.elements(KVCCompareSimplenoteAction, 1);
	});

	it('shows KVCCompareSimplenoteActionHeading', function () {
		browser.assert.elements(KVCCompareSimplenoteActionHeading, 1);
	});

	it('shows KVCCompareSimplenoteActionButton', function () {
		browser.assert.elements(KVCCompareSimplenoteActionButton, 1);
	});

	it('shows KVCRootLink', function () {
		browser.assert.elements('.KVCRootLink', 1);
	});

});
