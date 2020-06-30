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
		browser.assert.text('#TestControlMigrateCount', '1');
	});

	before(function () {
		return kTesting.uLaunch('FakeCreateNoteV1');
	});

	before(function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});
	
	before(function () {
		return kTesting.uLaunch('FakeStorageNotConnected');
	});
	
	before(function () {
		browser.assert.text('#TestControlMigrateCount', '2')
	});

	it('adds item', function () {
		browser.assert.elements('.KVCWriteMasterListItem', 1);
	});

	context('StorageSyncDone', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				FakeStorageIsConnected: true,
			});
		});

		before(function () {
			browser.assert.text('#TestControlMigrateCount', '0');
		});

		before(function () {
			return kTesting.uLaunch('FakeCreateNoteV1');
		});

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 0);
		});
		
		before(function () {
			return kTesting.uLaunch('FakeStorageSyncDone');
		});
		
		before(function () {
			browser.assert.text('#TestControlMigrateCount', '1')
		});

		it('adds item', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		context('second time', function () {
			
			before(function () {
				return kTesting.uLaunch('FakeStorageSyncDone');
			});
			
			it('skips migration', function () {
				browser.assert.text('#TestControlMigrateCount', '1')
			});
		
		});
	
	});

});
