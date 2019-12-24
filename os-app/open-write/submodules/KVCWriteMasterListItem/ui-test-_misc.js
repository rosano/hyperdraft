const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemAccessibilitySummary: 'alfa',
			KVCWriteMasterListItemTitle: 'bravo',
			KVCWriteMasterListItemSnippet: 'charlie',
		});
	});

	describe('KVCWriteMasterListItem', function test_KVCWriteMasterListItem () {
		
		it('sets aria-label', function () {
			browser.assert.attribute(KVCWriteMasterListItem, 'aria-label', 'alfa');
		});
		
		it('sets role', function () {
			browser.assert.attribute(KVCWriteMasterListItem, 'role', 'button');
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
