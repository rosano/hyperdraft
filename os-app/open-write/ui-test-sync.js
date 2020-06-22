const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const kTesting = {
	uSerial (inputData) {
		return inputData.reduce(function (coll, e) {
			return coll.then(e);
		}, Promise.resolve());
	},
	uLaunch (inputData) {
		return kTesting.uSerial([
			function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			},
			function () {
				return browser.fill('.LCHLauncherFilterInput', inputData);
			},
			function () {
				return browser.click('.LCHLauncherResultListItem');
			},
		]);
	},
};

describe('KVCWrite_Sync', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'alfa');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'bravo');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'charlie');
	});

	describe('OLSKChangeDelegateCreateNote', function test_OLSKChangeDelegateCreateNote () {

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 3);
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
		});

		it('adds note', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 4);
		});

		it('sorts list', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateCreateNote charlie bravo alfa');
		});

	});

});
