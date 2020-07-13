const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemObject: JSON.stringify({
				KVCNoteBody: 'alfa\nbravo',
			}),
		});
	});

	describe('KVCWriteMasterListItemTitle', function test_KVCWriteMasterListItemTitle () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemTitle, 'aria-hidden', 'true');
		});

		it('calls KVCWriteMasterListItemDispatchTitle', function () {
			browser.assert.text(KVCWriteMasterListItemTitle, '_KVCWriteMasterListItemDispatchTitle(alfa bravo)');
		});
	
	});

	describe('KVCWriteMasterListItemSnippet', function test_KVCWriteMasterListItemSnippet () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemSnippet, 'aria-hidden', 'true');
		});

		it('calls KVCWriteMasterListItemDispatchSnippet', function () {
			browser.assert.text(KVCWriteMasterListItemSnippet, '_KVCWriteMasterListItemDispatchSnippet(alfa bravo)');
		});
	
	});

});
