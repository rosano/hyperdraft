const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCTemplate = require('../_shared/KVCTemplate/main.js').default;

describe('KVCWriteListItem_Misc', function () {

	const title = Array.from(Array(100)).map(Math.random).join(' ');
	const body = Array.from(Array(100)).map(Math.random).join(' ');

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
		
		it('sets text', function () {
			browser.assert.text(KVCWriteListItemIsPublic, require('../open-write/ui-logic.js').default.KVCWritePublicSymbol());
		});
	
	});

	describe('KVCWriteListItemTitle', function test_KVCWriteListItemTitle () {
		
		it('sets text', function () {
			browser.assert.text(KVCWriteListItemTitle, KVCTemplate.KVCTemplateTruncated(title));
		});
	
	});

	describe('KVCWriteListItemSnippet', function test_KVCWriteListItemSnippet () {
		
		it('calls KVCWriteListItemDispatchSnippet', function () {
			browser.assert.text(KVCWriteListItemSnippet, require('OLSKString').OLSKStringSnippet(body));
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
