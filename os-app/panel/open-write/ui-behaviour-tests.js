import { throws, deepEqual } from 'assert';

const Browser = require('zombie');

Browser.localhost(process.env.ZOMBIE_HOST, 3000);

const kTesting = {
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
};

describe('WKCWriteBehaviourVisibility', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('on startup', function() {
		browser.assert.elements(kTesting.WKCWriteFilterInput, 1);
		browser.assert.elements(kTesting.WKCWriteCreateButton, 1);

		browser.assert.elements(kTesting.WKCWriteListItem, 0);
		browser.assert.elements(kTesting.WKCWriteExportButton, 1);
		
		browser.assert.elements(kTesting.WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(kTesting.WKCWriteDetailToolbar, 0);

		browser.assert.elements(kTesting.WKCWriteEditorContainer, 0);

		browser.assert.elements(kTesting.WKCWriteReloadButton, 1);
	});

	it('on create', async function() {
		browser.pressButton(kTesting.WKCWriteCreateButton);
		await browser.wait({ element: kTesting.WKCWriteListItem });

		browser.assert.elements(kTesting.WKCWriteListItem, 1);

		browser.assert.elements(kTesting.WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(kTesting.WKCWriteDetailToolbar, 1);
		browser.assert.elements(kTesting.WKCWriteDetailToolbarBackButton, 1);
		browser.assert.elements(kTesting.WKCWriteDetailToolbarJumpButton, 1);
		browser.assert.attribute(kTesting.WKCWriteDetailToolbarJumpButton, 'disabled', '');
		browser.assert.elements(kTesting.WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(kTesting.WKCWriteDetailToolbarPublishButton, 0);
		browser.assert.elements(kTesting.WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(kTesting.WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(kTesting.WKCWriteEditorContainer, 1);
	});

	it.skip('on publish', async function() {
	});

	it.skip('type header', async function() {
		// browser.fire(kTesting.WKCWriteEditorContainer, 'keydown')
		browser.assert.attribute(kTesting.WKCWriteDetailToolbarJumpButton, 'disabled', '');
	});

});

describe('WKCWriteBehaviourLocalizationEN', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('localizes interface', function() {
		deepEqual(browser.query(kTesting.WKCWriteCreateButton).title, 'Add note');
	});

});

describe('WKCWriteBehaviourInteraction', function() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('has no items', async function() {
		browser.assert.elements(kTesting.WKCWriteListItem, 0);
	});

	it('creates item', async function() {
		browser.pressButton(kTesting.WKCWriteCreateButton);
		await browser.wait({ element: kTesting.WKCWriteListItem });
		browser.assert.elements(kTesting.WKCWriteListItem, 1);
	});

});
