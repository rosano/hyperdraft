import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteMasterListItemAccessibilitySummary: 'alfa',
			WKCWriteMasterListItemTitle: 'bravo',
			WKCWriteMasterListItemSnippet: 'charlie',
		});
	});

	describe('WKCWriteMasterListItemAccessibilitySummary', function test_WKCWriteMasterListItemAccessibilitySummary () {
		
		it('classes OLSKScreenReaderOnly', function () {
			browser.assert.hasClass(WKCWriteMasterListItemAccessibilitySummary, 'OLSKScreenReaderOnly');
		});

		it('binds WKCWriteMasterListItemAccessibilitySummary', function () {
			browser.assert.text(WKCWriteMasterListItemAccessibilitySummary, 'alfa');
		});
	
	});

	describe('WKCWriteMasterListItemTitle', function test_WKCWriteMasterListItemTitle () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(WKCWriteMasterListItemTitle, 'aria-hidden', 'true');
		});

		it('binds WKCWriteMasterListItemTitle', function () {
			browser.assert.text(WKCWriteMasterListItemTitle, 'bravo');
		});
	
	});

	describe('WKCWriteMasterListItemSnippet', function test_WKCWriteMasterListItemSnippet () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(WKCWriteMasterListItemSnippet, 'aria-hidden', 'true');
		});

		it('binds WKCWriteMasterListItemSnippet', function () {
			browser.assert.text(WKCWriteMasterListItemSnippet, 'charlie');
		});
	
	});

});
