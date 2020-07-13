const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteMasterListItem: '.KVCWriteMasterListItem',

	KVCWriteMasterListItemTitle: '.KVCWriteMasterListItemTitle',
	KVCWriteMasterListItemSnippet: '.KVCWriteMasterListItemSnippet',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteMasterListItem_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemObject: JSON.stringify({}),
		});
	});

	it('shows KVCWriteMasterListItem', function () {
		browser.assert.elements(KVCWriteMasterListItem, 1);
	});

	it('shows KVCWriteMasterListItemTitle', function () {
		browser.assert.elements(KVCWriteMasterListItemTitle, 1);
	});

	it('shows KVCWriteMasterListItemSnippet', function () {
		browser.assert.elements(KVCWriteMasterListItemSnippet, 1);
	});

});
