import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemAccessibilitySummary: 'alfa',
			KVCWriteMasterListItemTitle: 'bravo',
			KVCWriteMasterListItemSnippet: 'charlie',
		});
	});

	describe('KVCWriteMasterListItemAccessibilitySummary', function test_KVCWriteMasterListItemAccessibilitySummary () {
		
		it('classes OLSKScreenReaderOnly', function () {
			browser.assert.hasClass(KVCWriteMasterListItemAccessibilitySummary, 'OLSKScreenReaderOnly');
		});

		it('binds KVCWriteMasterListItemAccessibilitySummary', function () {
			browser.assert.text(KVCWriteMasterListItemAccessibilitySummary, 'alfa');
		});
	
	});

	describe('KVCWriteMasterListItemTitle', function test_KVCWriteMasterListItemTitle () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemTitle, 'aria-hidden', 'true');
		});

		it('binds KVCWriteMasterListItemTitle', function () {
			browser.assert.text(KVCWriteMasterListItemTitle, 'bravo');
		});
	
	});

	describe('KVCWriteMasterListItemSnippet', function test_KVCWriteMasterListItemSnippet () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemSnippet, 'aria-hidden', 'true');
		});

		it('binds KVCWriteMasterListItemSnippet', function () {
			browser.assert.text(KVCWriteMasterListItemSnippet, 'charlie');
		});
	
	});

});
