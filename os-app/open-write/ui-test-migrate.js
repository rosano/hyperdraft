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
				return browser.click('.LCHLauncherPipeItem');
			},
		]);
	},
};

describe('KVCWrite_Migrate', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		browser.assert.text('#TestControlMigrateCount', '1')
	});

	before(function () {
		return kTesting.uLaunch('FakeCreateNoteV1');
	});

	before(function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});
	
	before(function () {
		return kTesting.uLaunch('FakeMigrateV1');
	});
	
	before(function () {
		browser.assert.text('#TestControlMigrateCount', '2')
	});

	it('adds item', function () {
		browser.assert.elements('.KVCWriteMasterListItem', 1);
	});

});
