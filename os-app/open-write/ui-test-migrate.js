const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Migrate', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		browser.assert.text('#TestControlMigrateCount', '1');
	});

	before(function () {
		return uLaunch('FakeCreateNoteV1');
	});

	before(function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});
	
	before(function () {
		return uLaunch('FakeStorageNotConnected');
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
			return uLaunch('FakeCreateNoteV1');
		});

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 0);
		});
		
		before(function () {
			return uLaunch('FakeStorageSyncDone');
		});
		
		before(function () {
			browser.assert.text('#TestControlMigrateCount', '1')
		});

		it('adds item', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		context('second time', function () {
			
			before(function () {
				return uLaunch('FakeStorageSyncDone');
			});
			
			it('skips migration', function () {
				browser.assert.text('#TestControlMigrateCount', '1')
			});
		
		});
	
	});

});
