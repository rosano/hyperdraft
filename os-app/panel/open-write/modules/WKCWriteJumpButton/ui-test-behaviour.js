import { deepEqual } from 'assert';

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

	context('inputData', function() {

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
				deepEqual(browser.query(WKCWriteJumpButton).title, uLocalized('WKCWriteJumpButtonText'));
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
		await browser.wait({ element: '.LCHLauncherFilterPrompt' });

		browser.assert.elements('.LCHLauncherFilterPrompt', 1);
	});

	it('runs callback on select', async function() {
		deepEqual(browser.query('#WKCWriteJumpButtonTestRun').textContent, '0');

		browser.click('.LCHLauncherResultListItem');
		// await browser.wait({ element: '.LCHLauncherResultListItem' });

		browser.assert.elements('.LCHLauncherFilterPrompt', 0);
		deepEqual(browser.query('#WKCWriteJumpButtonTestRun').textContent, '1');
	});

});
