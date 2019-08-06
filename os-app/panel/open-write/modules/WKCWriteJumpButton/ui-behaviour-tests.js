import { throws, deepEqual } from 'assert';

const Browser = require('zombie');

Browser.localhost('loc.tests', 3000);

const browser = new Browser();
const kDefaultRoutePath = '/modules/WKCWriteJumpButton';
const WKCWriteJumpButton = '.WKCWriteJumpButton'; 

describe('WKCWriteJumpButtonDiscovery', function testWKCWriteJumpButtonDiscovery() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('on startup', function() {
		browser.assert.elements(WKCWriteJumpButton, 1);
		browser.assert.attribute(WKCWriteJumpButton, 'accesskey', 'r');
		browser.assert.attribute(WKCWriteJumpButton, 'disabled', '');
		browser.assert.attribute(WKCWriteJumpButton, 'tabIndex', '-1');
	});

	describe('inputData', function() {

		it('enables if not empty', async function() {
			browser.pressButton('#WKCWriteJumpButtonTestSetOne');
			await browser.wait({ element: WKCWriteJumpButton });

			browser.assert.attribute(WKCWriteJumpButton, 'disabled', null);
		});

		it('disables if empty', async function() {
			browser.pressButton('#WKCWriteJumpButtonTestSetZero');
			await browser.wait({ element: WKCWriteJumpButton });

			browser.assert.attribute(WKCWriteJumpButton, 'disabled', '');
		});

	});

});

describe('WKCWriteJumpButtonLanguage', function testWKCWriteJumpButtonLanguage() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {

			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(kDefaultRoutePath);
			});

			it('on startup', function() {
				deepEqual(browser.query(WKCWriteJumpButton).textContent, '');
				// deepEqual(browser.query(WKCWriteJumpButton).title, uLocalized('WKCWriteJumpButtonText'));
				deepEqual(browser.query(WKCWriteJumpButton).title, 'Jump');
			});

		});
		
	});
});

describe('WKCWriteJumpButtonInteraction', function testWKCWriteJumpButtonInteraction() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	it('runs Launchlet on click', async function() {
		browser.pressButton('#WKCWriteJumpButtonTestSetOne');
		await browser.wait({ element: WKCWriteJumpButton });

		browser.pressButton(WKCWriteJumpButton);
		await browser.wait({ element: '.Container .Bezel' });

		browser.assert.elements('.Container .Bezel', 1);
	});

	it('runs callback on select', async function() {
		deepEqual(browser.query('#WKCWriteJumpButtonTestRun').textContent, '0');

		browser.click('.ListItem');
		await browser.wait({ element: '.ListItem' });

		browser.assert.elements('.Container .Bezel', 0);
		deepEqual(browser.query('#WKCWriteJumpButtonTestRun').textContent, '1');
	});

});
