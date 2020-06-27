const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemTitle: 'bravo',
			KVCWriteMasterListItemSnippet: 'charlie',
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
