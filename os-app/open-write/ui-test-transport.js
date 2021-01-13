const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Transport', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('ImportJSON', function test_ImportJSON() {

		const KVCNoteBody = Date.now().toString();

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemFakeInputFile');
		});

		before(function () {
			return browser.OLSKPrompt(function () {
				return browser.click('.LCHLauncherPipeItem');
			}, function (dialog) {
				dialog.response = JSON.stringify([StubNoteObjectValid({
					KVCNoteBody,
				})]);

				return dialog;
			});
		});

		it('creates item', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', KVCNoteBody);
		});

	});

});