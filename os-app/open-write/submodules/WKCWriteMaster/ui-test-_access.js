import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteMaster: '.WKCWriteMaster',
	
	WKCWriteMasterToolbar: '.WKCWriteMasterToolbar',
	
	WKCWriteMasterCreateButton: '.WKCWriteMasterCreateButton',

	WKCWriteMasterBody: '.WKCWriteMasterBody',
	WKCWriteMasterListItem: '.WKCWriteMasterListItem',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteMaster_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WKCWriteMaster', function () {
		browser.assert.elements(WKCWriteMaster, 1);
	});

	it('shows WKCWriteMasterToolbar', function () {
		browser.assert.elements(WKCWriteMasterToolbar, 1);
	});

	it('shows OLSKToolbar', function () {
		browser.assert.elements('.OLSKToolbar', 1);
	});

	it('shows WKCWriteMasterCreateButton', function () {
		browser.assert.elements(WKCWriteMasterCreateButton, 1);
	});

	it('shows WKCWriteMasterBody', function () {
		browser.assert.elements(WKCWriteMasterBody, 1);
	});

	it('hides WKCWriteMasterListItem', function () {
		browser.assert.elements(WKCWriteMasterListItem, 0);
	});

	context('WKCWriteMasterListItems', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterListItems: JSON.stringify([{
					WKCDocumentName: 'alfa',
				}]),
			});
		});

		it('shows WKCWriteMasterListItem', function () {
			browser.assert.elements(WKCWriteMasterListItem, 1);
		});
		
	});

});
