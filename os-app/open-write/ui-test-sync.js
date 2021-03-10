const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Sync', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		return browser.pressButton('.KVCWriteCreateButton');
	});

	before(function () {
		return browser.fill('.KVCWriteInputFieldDebug', 'alfa');
	});

	before(function () {
		return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
	});

	describe('ZDRSchemaDispatchSyncCreateNote', function test_ZDRSchemaDispatchSyncCreateNote () {

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
		});

		it('adds item', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 2);
		});

		it('sorts list', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncCreateNote alfa');
		});

		context('selected', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'alfa2');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
			});

			it('adds item', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncCreateNote FakeZDRSchemaDispatchSyncCreateNote alfa2');
			});
		
		});

	});

	describe('ZDRSchemaDispatchSyncUpdateNote', function test_ZDRSchemaDispatchSyncUpdateNote () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncCreateNote alfa2 FakeZDRSchemaDispatchSyncCreateNote');
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncUpdateNote');
		});

		it('updates item', function () {
			browser.assert.text('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncUpdateNote');
		});

		it('sorts list', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncUpdateNote FakeZDRSchemaDispatchSyncCreateNote alfa2');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'bravo');
			});

			before(function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeZDRSchemaDispatchSyncCreateNote alfa2');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncUpdateNote');
			});

			it('updates item', function () {
				browser.assert.elements('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncUpdateNote');
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeZDRSchemaDispatchSyncUpdateNote alfa2');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
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
			return browser.click('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'alfa3');
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeEscapeWithoutSort');
		});

		before(function () {
			browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeZDRSchemaDispatchSyncUpdateNote alfa3');
		});

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 3);
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
		});

		it('removes item', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 2);
		});

		it('skips sort', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa3');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'alfa4');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
			});

			before(function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
			});

			it('removes item', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa4');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
			});

			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem');
			});

			before(function () {
				browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncCreateNote bravo alfa4');
			});

			before(function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
			});

			it('removes item', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('clear detail', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa4');
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
			browser.assert.text('.KVCWriteMasterListItem', 'FakeZDRSchemaDispatchSyncConflictNote-local alfa4 bravo');
		});

	});

});
