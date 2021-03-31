const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Version', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	const createCount = Math.max(3, Date.now() % 10);
	const discardCount = Math.max(1, Date.now() % createCount);
	
	context('create', function test_create () {

		before(function () {
			browser.assert.evaluate(`localStorage.getItem('KVC_VERSION_MAP')`, null);
		});

		Array.from(Array(createCount)).forEach(function () {
			
			before(function () {
				return browser.pressButton('.KVCWriteCreateButton');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', Math.random().toString());
			});

		});

		it('calls OLSKVersionAdd', function () {
			browser.assert.evaluate(`Object.keys(JSON.parse(localStorage.getItem('KVC_VERSION_MAP'))).length`, createCount)
		});
	
	});

	context('discard', function test_discard () {

		Array.from(Array(discardCount)).forEach(function () {

			before(function () {
				return browser.click('.KVCWriteListItem');
			});
			
			before(function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
				});
			});

		});

		it('calls OLSKVersionClear', function () {
			browser.assert.evaluate(`Object.keys(JSON.parse(localStorage.getItem('KVC_VERSION_MAP'))).length`, createCount - discardCount);
		});
	
	});

	context('sync', function test_sync () {

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncCreateNote');
		});

		before(function () {
			return browser.click('.KVCWriteListItem');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'FakeZDRSchemaDispatchSyncCreateNote');
		});

		before(function () {
			browser.assert.evaluate(`Object.keys(JSON.parse(localStorage.getItem('KVC_VERSION_MAP'))).length`, createCount - discardCount + 1);
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeZDRSchemaDispatchSyncDeleteNote');
		});

		it('calls OLSKVersionClear', function () {
			browser.assert.evaluate(`Object.keys(JSON.parse(localStorage.getItem('KVC_VERSION_MAP'))).length`, createCount - discardCount);
		});

	});

});
