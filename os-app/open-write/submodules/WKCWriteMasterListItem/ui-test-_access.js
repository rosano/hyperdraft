import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteMasterListItem: '.WKCWriteMasterListItem',
	
	WKCWriteMasterListItemAccessibilitySummary: '.WKCWriteMasterListItemAccessibilitySummary',
	
	WKCWriteMasterListItemTitle: '.WKCWriteMasterListItemTitle',
	WKCWriteMasterListItemSnippet: '.WKCWriteMasterListItemSnippet',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteMasterListItem_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteMasterListItemAccessibilitySummary: 'alfa',
			WKCWriteMasterListItemTitle: 'bravo',
			WKCWriteMasterListItemSnippet: 'charlie',
		});
	});

	it('shows WKCWriteMasterListItem', function () {
		browser.assert.elements(WKCWriteMasterListItem, 1);
	});

	it('shows WKCWriteMasterListItemTitle', function () {
		browser.assert.elements(WKCWriteMasterListItemTitle, 1);
	});

	it('shows WKCWriteMasterListItemSnippet', function () {
		browser.assert.elements(WKCWriteMasterListItemSnippet, 1);
	});

});
