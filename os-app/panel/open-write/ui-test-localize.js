import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().WIKWriteRoute;

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, languageCode);
};

describe(`WKCWriteUILocalize-${ languageCode }`, function () {

	before(function() {
		return browser.visit(`${ languageCode }${ kDefaultRoute.OLSKRoutePath }`);
	});

	it('on startup', function() {
		browser.assert.attribute(WKCWriteFilterInput, 'placeholder', uLocalized('WKCWriteFilterInputPlaceholderText'));
		deepEqual(browser.query(WKCWriteCreateButton).title, uLocalized('WKCWriteMasterToolbarCreateButtonText'));

		deepEqual(browser.query(WKCWriteExportButton).textContent, uLocalized('WKCUpdateExportText'));

		deepEqual(browser.query(WKCWriteDetailPlaceholderContainer).textContent, uLocalized('WKCWriteDetailPlaceholderText'));

		deepEqual(browser.query(WKCWriteReloadButton).title, uLocalized('WKCWriteFooterToolbarReloadButtonText'));
	});

	it('on create', async function() {
		await uCreateItem(browser);

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
		deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
		deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');

		// deepEqual(browser.query(WKCWriteDetailToolbarBackButton).title, uLocalized('WKCWriteDetailToolbarBackButtonText'));
		deepEqual(browser.query(WKCWriteDetailToolbarVersionsButton).title, uLocalized('WKCWriteDetailToolbarVersionsButtonText'));
		deepEqual(browser.query(WKCWriteDetailToolbarDiscardButton).title, uLocalized('WKCWriteDetailToolbarDiscardButtonText'));
		
		deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
	});

	it('on edit title', async function() {
		browser.fill(WKCWriteEditorDebugInput, 'alfa');
		await browser.wait({ element: WKCWriteListItem });

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
		deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
		deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
	});

	it('on edit body', async function() {
		browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
		await browser.wait({ element: WKCWriteListItem });

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
		deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
		deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'bravo');
	});

	it('on edit long title', async function() {
		browser.fill(WKCWriteEditorDebugInput, 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilos');
		await browser.wait({ element: WKCWriteListItem });

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
		deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
		deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
	});

	it('on edit long body', async function() {
		browser.fill(WKCWriteEditorDebugInput, '\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
		await browser.wait({ element: WKCWriteListItem });

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
		deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
		deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');

		browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
	});

	it('on create nth item', async function() {
		await uCreateItem(browser);

		deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
	});

	it('on select 1st item', async function() {
		browser.click(`${ WKCWriteListItem }:nth-child(2)`);
		await browser.wait({ element: WKCWriteListItem });

		deepEqual(browser.query(WKCWriteEditorDebugInput).value, 'alfa\nbravo');
	});

	it('on delete', async function() {
		deepEqual((await browser.OLSKConfirm(async function () {
			await browser.pressButton(WKCWriteDetailToolbarDiscardButton);
		})).question, uLocalized('WKCWriteNotesDeleteAlertText'));
	});

});

});
