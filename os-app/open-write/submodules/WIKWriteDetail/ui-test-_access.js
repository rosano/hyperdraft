import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WIKWriteDetail: '.WIKWriteDetail',
	
	WIKWriteDetailPlaceholder: '.WIKWriteDetailPlaceholder',

	WIKWriteDetailToolbar: '.WIKWriteDetailToolbar',
	WIKWriteDetailToolbarBackButton: '.WIKWriteDetailToolbarBackButton',
	WIKWriteDetailToolbarDiscardButton: '.WIKWriteDetailToolbarDiscardButton',
	
	WIKWriteDetailForm: '.WIKWriteDetailForm',
	WIKWriteDetailFormNameField: '.WIKWriteDetailFormNameField',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WIKWriteDetail_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WIKWriteDetail', function () {
		browser.assert.elements(WIKWriteDetail, 1);
	});

	it('shows WIKWriteDetailPlaceholder', function () {
		browser.assert.elements(WIKWriteDetailPlaceholder, 1);
	});

	it('hides WIKWriteDetailToolbar', function () {
		browser.assert.elements(WIKWriteDetailToolbar, 0);
	});

	it('hides WIKWriteDetailForm', function () {
		browser.assert.elements(WIKWriteDetailForm, 0);
	});

	context('WIKWriteDetailItem', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					EMTDocumentName: 'alfa',
				}),
			});
		});

		it('hides WIKWriteDetailPlaceholder', function () {
			browser.assert.elements(WIKWriteDetailPlaceholder, 0);
		});

		it('shows OLSKToolbar', function () {
			browser.assert.elements('.OLSKToolbar', 1);
		});

		it('shows WIKWriteDetailToolbar', function () {
			browser.assert.elements(WIKWriteDetailToolbar, 1);
		});

		it('shows WIKWriteDetailToolbarBackButton', function () {
			browser.assert.elements(WIKWriteDetailToolbarBackButton, 1);
		});

		it('shows WIKWriteDetailToolbarDiscardButton', function () {
			browser.assert.elements(WIKWriteDetailToolbarDiscardButton, 1);
		});

		it('shows WIKWriteDetailForm', function () {
			browser.assert.elements(WIKWriteDetailForm, 1);
		});

		it('shows WIKWriteDetailFormNameField', function () {
			browser.assert.elements(WIKWriteDetailFormNameField, 1);
		});
		
	});

});
