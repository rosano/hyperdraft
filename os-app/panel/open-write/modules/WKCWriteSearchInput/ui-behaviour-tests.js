import { throws, deepEqual } from 'assert';

const browser = new OLSKBrowser();
const kDefaultRoutePath = '/modules/WKCWriteSearchInput';
const WKCWriteSearchInput = '.WKCWriteSearchInput';
const WKCWriteSearchInputClearButton = '.WKCWriteSearchInputClearButton';

describe('WKCWriteSearchInputDiscovery', function testWKCWriteSearchInputDiscovery() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('on startup', function() {
		browser.assert.elements(WKCWriteSearchInput, 1);
		browser.assert.attribute(WKCWriteSearchInput, 'accesskey', 'f');

		browser.assert.elements(WKCWriteSearchInputClearButton, 0);
	});

	context('WKCWriteSearchInputClearButton', function() {

		it('shows if inputData', async function() {
			browser.pressButton('#WKCWriteSearchInputTestSetFilled');
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			browser.assert.elements(WKCWriteSearchInputClearButton, 1);
		});

		it('hides if no inputData', async function() {
			browser.pressButton('#WKCWriteSearchInputTestSetBlank');
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			browser.assert.elements(WKCWriteSearchInputClearButton, 0);
		});

	});

});

describe('WKCWriteSearchInputLanguage', function testWKCWriteSearchInputLanguage() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {

			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(kDefaultRoutePath);
			});

			it('on startup', function() {
				// deepEqual(browser.query(WKCWriteSearchInput).placeholder, uLocalized('WKCWriteSearchInputPlaceholderText'));
				deepEqual(browser.query(WKCWriteSearchInput).placeholder, 'Filter or create');
			});

			it('if inputData', async function() { 
				browser.pressButton('#WKCWriteSearchInputTestSetFilled');
				await browser.wait({ element: WKCWriteSearchInputClearButton });

				// deepEqual(browser.query(WKCWriteSearchInputClearButton).title, uLocalized('WKCWriteSearchInputClearButtonText'));
				deepEqual(browser.query(WKCWriteSearchInputClearButton).title, 'Clear text');
				deepEqual(browser.query(WKCWriteSearchInputClearButton).textContent, '');
			});

		});
		
	});
});

describe('WKCWriteSearchInputInteraction', function testWKCWriteSearchInputInteraction() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	context('WKCWriteSearchInputClearButton', function() {

		it('fires callback on click', async function() {
			deepEqual(browser.query('#WKCWriteSearchInputTestRun').textContent, '0');

			browser.fill(WKCWriteSearchInput, 'alfa');
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			browser.pressButton(WKCWriteSearchInputClearButton);
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			deepEqual(browser.query('#WKCWriteSearchInputTestRun').textContent, '1');
		});

	});

});
