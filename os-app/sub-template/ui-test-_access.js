const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteTemplate: '.KVCWriteTemplate',
	
	KVCWriteTemplateDataField: '.KVCWriteTemplateDataField',
	KVCWriteTemplateUpdateButton: '.KVCWriteTemplateUpdateButton',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KVCWriteTemplate_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteTemplate', function () {
		browser.assert.elements(KVCWriteTemplate, 1);
	});

	it('shows KVCWriteTemplateDataField', function () {
		browser.assert.elements(KVCWriteTemplateDataField, 1);
	});

	it('shows KVCWriteTemplateUpdateButton', function () {
		browser.assert.elements(KVCWriteTemplateUpdateButton, 1);
	});

});
