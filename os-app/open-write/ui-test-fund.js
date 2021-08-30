const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Fund', function () {

	require('OLSKFund/ui-test_template').default({
		
		kDefaultRoute,

		ParamProject: process.env.ROCO_SHARED_PROJECT_ID,
		
		ParamTriggerGate () {
			return browser.pressButton('.KVCWriteCreateButton');
		},

		ParamCreateDocument () {
			return browser.pressButton('.KVCWriteCreateButton');
		},

		async ParamDeleteDocument () {
			await browser.click('.OLSKCollectionItem');

			return browser.OLSKConfirm(function () {
				return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
			});
		},

		ParamCreateDocumentSync () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
		},

	});
	
});
