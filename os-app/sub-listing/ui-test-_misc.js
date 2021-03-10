const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMasterListItem_Misc', function () {

	const title = Math.random().toString();
	const body = Math.random().toString();

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteMasterListItemObject: JSON.stringify(StubNoteObjectValid({
				KVCNoteBody: title + '\n' + body,
				KVCNoteIsPublic: true,
			})),
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
			browser.assert.text(KVCWriteMasterListItemIsPublic, require('../open-write/ui-logic.js').default.KVCWriteLogicPublicSymbol());
		});
	
	});

	describe('KVCWriteMasterListItemTitle', function test_KVCWriteMasterListItemTitle () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemTitle, 'aria-hidden', 'true');
		});

		it('calls KVCWriteMasterListItemDispatchTitle', function () {
			browser.assert.text(KVCWriteMasterListItemTitle, title);
		});
	
	});

	describe('KVCWriteMasterListItemSnippet', function test_KVCWriteMasterListItemSnippet () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteMasterListItemSnippet, 'aria-hidden', 'true');
		});

		it('calls KVCWriteMasterListItemDispatchSnippet', function () {
			browser.assert.text(KVCWriteMasterListItemSnippet, body);
		});
	
	});

	context('KVCNoteIsArchived', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItemObject: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsArchived: true,
				})),
			});
		});

		it('classes KVCWriteMasterListItemArchived', function () {
			browser.assert.hasClass(KVCWriteMasterListItem, 'KVCWriteMasterListItemArchived');
		});
	
	});

});
