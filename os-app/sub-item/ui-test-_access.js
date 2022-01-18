const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteListItem: '.KVCWriteListItem',

	KVCWriteListItemIsPublic: '.KVCWriteListItemIsPublic',
	KVCWriteListItemTitle: '.KVCWriteListItemTitle',
	KVCWriteListItemSnippet: '.KVCWriteListItemSnippet',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KVCWriteListItem_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteListItemObject: JSON.stringify(StubNoteObjectValid()),
		});
	});

	it('shows KVCWriteListItem', function () {
		browser.assert.elements(KVCWriteListItem, 1);
	});

	it('hides KVCWriteListItemIsPublic', function () {
		browser.assert.elements(KVCWriteListItemIsPublic, 0);
	});

	it('shows KVCWriteListItemTitle', function () {
		browser.assert.elements(KVCWriteListItemTitle, 1);
	});

	it('shows KVCWriteListItemSnippet', function () {
		browser.assert.elements(KVCWriteListItemSnippet, 1);
	});

	context('KVCNoteIsPublic', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteListItemObject: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsPublic: true,
				})),
			});
		});

		it('shows KVCWriteListItemIsPublic', function () {
			browser.assert.elements(KVCWriteListItemIsPublic, 1);
		});
	
	});

});
