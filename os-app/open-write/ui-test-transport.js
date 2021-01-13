const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Transport', function () {	

	const KVCNoteBody = Date.now().toString();

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('ImportJSON', function test_ImportJSON() {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportSerialized');
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

	describe('ExportJSON', function test_ExportJSON() {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_AlertFakeExportSerialized');
		});

		it('exports file', function() {
			const response = JSON.parse(browser.OLSKAlert(function () {
    		return browser.click('.LCHLauncherPipeItem');
    	}));

    	const date = response.OLSKDownloadName.split('-').pop().split('.').shift();
    	const item = JSON.parse(response.OLSKDownloadData)[0];

    	browser.assert.deepEqual(response, {
    		OLSKDownloadName: `${ browser.window.location.hostname }-${ date }.json`,
    		OLSKDownloadData: JSON.stringify([Object.assign(Object.assign({}, item), {
    			KVCNoteBody,
    		})]),
    	});
    });

	});

});