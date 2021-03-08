const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Transport', function () {	

	const json = {};

	describe('KVCWriteLauncherItemImportJSON', function test_KVCWriteLauncherItemImportJSON() {

		const KVCNoteBody = Math.random().toString();

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

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
				dialog.response = JSON.stringify({
					KVCNote: [StubNoteObjectValid({
						KVCNoteBody,
					})],
					KVCSetting: [StubSettingObjectValid()],
				});

				Object.assign(json, JSON.parse(dialog.response));

				return dialog;
			});
		});

		it('creates note', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', KVCNoteBody);
		});

	});

	describe('LCHComposeLauncherItemExportJSON', function test_LCHComposeLauncherItemExportJSON() {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_AlertFakeExportSerialized');
		});

		it('exports file', async function() {
			const response = JSON.parse(await browser.OLSKAlertTextAsync(function () {
    		return browser.click('.LCHLauncherPipeItem');
    	}));

    	const date = response.OLSKDownloadName.split('-').pop().split('.').shift();

    	browser.assert.deepEqual(Object.assign(response, {
    		OLSKDownloadData: JSON.parse(response.OLSKDownloadData),
    	}), {
    		OLSKDownloadName: `${ browser.window.location.hostname }-${ date }.json`,
    		OLSKDownloadData: json,
    	});
    });

	});

	describe('ImportTXT', function test_ImportTXT() {

		const _LCHReadTextFileObjectContent = Math.random().toString();

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportPlain');
		});

		before(function () {
			return browser.OLSKPrompt(function () {
				return browser.click('.LCHLauncherPipeItem');
			}, function (dialog) {
				dialog.response = JSON.stringify({
					_LCHReadTextFileObjectContent,
				});

				return dialog;
			});
		});

		it('creates item', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', _LCHReadTextFileObjectContent);
		});

	});

	describe('ImportNV', function test_ImportNV() {

		const title = Math.random().toString();

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportComplex');
		});

		before(function () {
			return browser.OLSKPrompt(function () {
				return browser.click('.LCHLauncherPipeItem');
			}, function (dialog) {
				dialog.response = JSON.stringify({
					name: title + '.' + Date.now().toString(),
					_LCHReadTextFileObjectContent: Math.random().toString(),
				});

				return dialog;
			});
		});

		it('creates item', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', title);
		});

	});

	describe('ExportZIP', function test_ExportZIP() {

		const KVCNoteBody = Math.random().toString();

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', KVCNoteBody);
		});

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_AlertFakeExportCompressed');
		});

		it('exports file', function() {
			const response = JSON.parse(browser.OLSKAlert(function () {
    		return browser.click('.LCHLauncherPipeItem');
    	}));

    	const date = response.OLSKDownloadName.split('-').pop().split('.').shift();

    	browser.assert.deepEqual(response, {
    		OLSKDownloadName: `${ browser.window.location.hostname }-${ date }.zip`,
    	});
    });

	});

});