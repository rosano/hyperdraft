import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteMaster: '.KVCWriteMaster',
	
	KVCWriteMasterToolbar: '.KVCWriteMasterToolbar',
	
	KVCWriteMasterFilterField: '.KVCWriteMasterFilterField',
	KVCWriteMasterCreateButton: '.KVCWriteMasterCreateButton',
	KVCWriteMasterCreateButtonImage: '.KVCWriteMasterCreateButtonImage',

	KVCWriteMasterBody: '.KVCWriteMasterBody',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteMaster_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteMaster', function () {
		browser.assert.elements(KVCWriteMaster, 1);
	});

	it('shows KVCWriteMasterToolbar', function () {
		browser.assert.elements(KVCWriteMasterToolbar, 1);
	});

	it('shows OLSKInputWrapper', function () {
		browser.assert.elements('.OLSKInputWrapper', 1);
	});

	it('shows KVCWriteMasterFilterField', function () {
		browser.assert.elements(KVCWriteMasterFilterField, 1);
	});

	it('shows KVCWriteMasterCreateButton', function () {
		browser.assert.elements(KVCWriteMasterCreateButton, 1);
	});

	it('shows KVCWriteMasterCreateButtonImage', function () {
		browser.assert.elements(KVCWriteMasterCreateButtonImage, 1);
	});

	it('shows KVCWriteMasterBody', function () {
		browser.assert.elements(KVCWriteMasterBody, 1);
	});

	it('shows OLSKResults', function () {
		browser.assert.elements('.OLSKResults', 1);
	});

	it('hides KVCWriteMasterListItem', function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});

	context('KVCWriteMasterListItems', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteBody: 'alfa',
				}]),
			});
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});
		
	});

});
