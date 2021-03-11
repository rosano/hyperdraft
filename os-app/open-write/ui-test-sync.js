const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Sync', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('ZDRSchemaDispatchSyncCreateNote', function test_ZDRSchemaDispatchSyncCreateNote () {

		before(function () {
			browser.assert.elements('.OLSKResultsListItem', 0);
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
		});

		it('adds item', function () {
			browser.assert.elements('.OLSKResultsListItem', 1);
		});

	});

	describe('ZDRSchemaDispatchSyncUpdateNote', function test_ZDRSchemaDispatchSyncUpdateNote () {

		before(function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeZDRSchemaDispatchSyncCreateNote');
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncUpdateNote');
		});

		it('updates item', function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeZDRSchemaDispatchSyncUpdateNote');
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'FakeZDRSchemaDispatchSyncCreateNote');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncUpdateNote');
			});

			it('updates detail', function () {
				browser.assert.input('.KVCWriteInputFieldDebug', 'FakeZDRSchemaDispatchSyncUpdateNote');
			});

		});

	});

	describe('ZDRSchemaDispatchSyncDeleteNote', function test_ZDRSchemaDispatchSyncDeleteNote () {

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
		});

		it('removes item', function () {
			browser.assert.elements('.OLSKResultsListItem', 0);
		});

		context('selected same', function () {
			
			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
			});

			before(function () {
				return browser.click('.OLSKResultsListItem');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
			});

			it('clears detail', function () {
				browser.assert.elements('.KVCWriteDetail', 0);
			});
		
		});

	});

	describe('ZDRSchemaDispatchSyncConflictNote', function test_ZDRSchemaDispatchSyncConflictNote () {

		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'FakeZDRSchemaDispatchSyncConflictNote');
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncConflictNote');
		});

		it('selects local', function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeZDRSchemaDispatchSyncConflictNote-local');
		});

	});

});
