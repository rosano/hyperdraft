const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemObject: JSON.stringify({
				KVCNoteBody: 'alfa\nbravo',
				KVCNoteIsPublic: true,
			}),
		});
	});

	describe('KVCWriteMasterListItem', function test_KVCWriteMasterListItem () {

		it('classes OLSKCommonEdgeBottom', function () {
			browser.assert.hasClass(KVCWriteMasterListItem, 'OLSKCommonEdgeBottom');
		});
		
	});

	describe('KVCWriteMasterListItemIsPublic', function test_KVCWriteMasterListItemIsPublic () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemIsPublic, 'aria-hidden', 'true');
		});

		it('sets text', function () {
			browser.assert.text(KVCWriteMasterListItemIsPublic, require('../../../open-write/ui-logic.js').default.KVCWriteLogicPublicSymbol());
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

	context('KVCNoteIsArchived', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItemObject: JSON.stringify({
					KVCNoteBody: 'alfa\nbravo',
					KVCNoteIsArchived: true,
				}),
			});
		});

		it('classes KVCWriteMasterListItemArchived', function () {
			browser.assert.hasClass(KVCWriteMasterListItem, 'KVCWriteMasterListItemArchived');
		});
	
	});

});
