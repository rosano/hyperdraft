import { throws, deepEqual } from 'assert';

const Browser = require('zombie');

Browser.localhost(process.env.ZOMBIE_HOST, 3000);

Object.entries({
	WKCWriteFilterInput: '#WIKDefaultFocusNode',
	WKCWriteCreateButton: '#WKCWriteCreateButton',

	WKCWriteListItem: '.ListItem',
	WKCWriteExportButton: '#WKCWriteExportButton',

	WKCWriteDetailPlaceholderContainer: '.PlaceholderContainer',

	WKCWriteDetailToolbar: '#WKCWriteDetailToolbar',
	WKCWriteDetailToolbarBackButton: '#WKCWriteDetailToolbarBackButton',

	WKCWriteDetailToolbarJumpButton: '#WKCWriteDetailToolbarJumpButton',
	WKCWriteDetailToolbarUnpublishButton: '#WKCWriteDetailToolbarUnpublishButton',
	WKCWriteDetailToolbarPublishButton: '#WKCWriteDetailToolbarPublishButton',
	WKCWriteDetailToolbarVersionsButton: '#WKCWriteDetailToolbarVersionsButton',
	WKCWriteDetailToolbarDiscardButton: '#WKCWriteDetailToolbarDiscardButton',

	WKCWriteEditorContainer: '.EditorContainer',

	WKCWriteReloadButton: '#WKCWriteReloadButton',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteBehaviourDiscovery', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteFilterInput, 1);
		browser.assert.elements(WKCWriteCreateButton, 1);

		browser.assert.elements(WKCWriteListItem, 0);
		browser.assert.elements(WKCWriteExportButton, 1);
		
		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(WKCWriteDetailToolbar, 0);

		browser.assert.elements(WKCWriteEditorContainer, 0);

		browser.assert.elements(WKCWriteReloadButton, 1);
	});

	it('on create', async function() {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });

		browser.assert.elements(WKCWriteListItem, 1);

		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(WKCWriteDetailToolbar, 1);
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarJumpButton, 1);
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
		browser.assert.elements(WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarPublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(WKCWriteEditorContainer, 1);
	});

	it.skip('on publish', async function() {
	});

	it.skip('type header', async function() {
		// browser.fire(WKCWriteEditorContainer, 'keydown')
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
	});

});

describe('WKCWriteBehaviourLocalizationEN', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('localizes interface', function() {
		deepEqual(browser.query(WKCWriteCreateButton).title, 'Add note');
	});

});

describe('WKCWriteBehaviourInteraction', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('has no items', async function() {
		browser.assert.elements(WKCWriteListItem, 0);
	});

	it('creates item', async function() {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
		browser.assert.elements(WKCWriteListItem, 1);
	});

});
