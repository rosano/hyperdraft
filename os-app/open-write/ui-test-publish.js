const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Publish', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		return browser.OLSKLauncherRun('FakeStorageIsConnected');
	});

	describe('template', function test_template () {

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'alfa\n[[bravo]]');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarPublishButton');
		});

		it('publishes with template', function () {
			browser.assert.text('#TestPublishContent .KVCArticleTitle', 'alfa');
		});

	});

	describe('backlinks', function test_backlinks () {

		before(function () {
			browser.assert.elements('#TestPublishContent .KVCBacklinks', 0);
		});

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'bravo');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarPublishButton');
		});

		it.skip('sets KVCOptionBacklinks', function () {
			browser.assert.elements('#TestPublishContent .KVCBacklinks', 1);
		});

	});

	describe('root_page', function test_root_page () {

		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemSetAsRootPage');
		});

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'charlie\n[[bravo]]');
		});

		before(function () {
			browser.assert.elements('#TestPublishContent .KVCRootLink', 0);
		});

		before(function () {
			// return browser.OLSKLauncherRun('FakeConfigureCustomDomain');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarPublishButton');
		});

		it('sets KVCOptionIsRoot', function () {
			browser.assert.elements('#TestPublishContent .KVCRootLink', 1);
		});

		it.skip('sets KVCOptionRootURL', function () {
			browser.assert.attribute('#TestPublishContent .KVCRootLink', 'href', 'FakeCustomDomainBaseURL');
		});

	});

});
