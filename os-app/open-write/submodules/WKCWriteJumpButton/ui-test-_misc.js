import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteJumpButton_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('WKCWriteJumpButton', function () {

		it('sets accesskey', function () {
			browser.assert.attribute(WKCWriteJumpButton, 'accesskey', 'r');
		});

		it('sets tabIndex', function () {
			browser.assert.attribute(WKCWriteJumpButton, 'tabIndex', '-1');
		});
		
		context('WKCWriteJumpButtonRecipes', function() {

			before(function () {
				browser.assert.attribute(WKCWriteJumpButton, 'disabled', '');
			});

			before(function () {
				return browser.pressButton('#WKCWriteJumpButtonTestSetOne');
			});

			it('sets disabled', function() {
				browser.assert.attribute(WKCWriteJumpButton, 'disabled', null);
			});

			it('runs Launchlet on click', async function() {
				browser.pressButton('#WKCWriteJumpButtonTestSetOne');
				await browser.wait({ element: WKCWriteJumpButton });

				browser.pressButton(WKCWriteJumpButton);
				await browser.wait({ element: '.LCHLauncherFilterPrompt' });

				browser.assert.elements('.LCHLauncherFilterPrompt', 1);
			});

			it('runs callback on select', async function() {
				browser.assert.text('#WKCWriteJumpButtonTestRun', '0');

				browser.click('.LCHLauncherResultListItem');
				// await browser.wait({ element: '.LCHLauncherResultListItem' });

				browser.assert.elements('.LCHLauncherFilterPrompt', 0);
				browser.assert.text('#WKCWriteJumpButtonTestRun', '1');
			});

		});
	
	});

});
