const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteListItem_Misc', function () {

	const title = Math.random().toString();
	const body = Math.random().toString();

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteListItemObject: JSON.stringify(StubNoteObjectValid({
				KVCNoteBody: title + '\n' + body,
				KVCNoteIsPublic: true,
			})),
		});
	});

	describe('KVCWriteListItem', function test_KVCWriteListItem () {

		it('classes OLSKCommonEdgeBottom', function () {
			browser.assert.hasClass(KVCWriteListItem, 'OLSKCommonEdgeBottom');
		});
		
	});

	describe('KVCWriteListItemIsPublic', function test_KVCWriteListItemIsPublic () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteListItemIsPublic, 'aria-hidden', 'true');
		});

		it('sets text', function () {
			browser.assert.text(KVCWriteListItemIsPublic, require('../open-write/ui-logic.js').default.KVCWriteLogicPublicSymbol());
		});
	
	});

	describe('KVCWriteListItemTitle', function test_KVCWriteListItemTitle () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteListItemTitle, 'aria-hidden', 'true');
		});

		it('calls KVCWriteListItemDispatchTitle', function () {
			browser.assert.text(KVCWriteListItemTitle, title);
		});
	
	});

	describe('KVCWriteListItemSnippet', function test_KVCWriteListItemSnippet () {
		
		it('sets aria-hidden', function () {
			browser.assert.attribute(KVCWriteListItemSnippet, 'aria-hidden', 'true');
		});

		it('calls KVCWriteListItemDispatchSnippet', function () {
			browser.assert.text(KVCWriteListItemSnippet, body);
		});
	
	});

	context('KVCNoteIsArchived', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteListItemObject: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsArchived: true,
				})),
			});
		});

		it('classes KVCWriteListItemArchived', function () {
			browser.assert.hasClass(KVCWriteListItem, 'KVCWriteListItemArchived');
		});
	
	});

});
