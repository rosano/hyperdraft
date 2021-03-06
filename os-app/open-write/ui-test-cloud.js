const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, 'en');
};

describe('KVCWrite_Cloud', function () {

	describe('OLSKAppToolbar', function test_OLSKAppToolbar() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute);
		});

		before(function () {
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchConnected');
		});

		before(function () {
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchOnline');
		});

		it('sets OLSKAppToolbarCloudOffline', function () {
			browser.assert.text('.OLSKAppToolbarCloudStatus', uLocalized('OLSKAppToolbarCloudStatusOnline'));
		});

		context('offline', function () {

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchOffline');
			});

			it('sets OLSKAppToolbarCloudOffline', function () {
				browser.assert.text('.OLSKAppToolbarCloudStatus', uLocalized('OLSKAppToolbarCloudStatusOffline'));
			});
		
		});

		context('error', function () {

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchError');
			});

			it('sets OLSKAppToolbarCloudError', function () {
				browser.assert.text('.OLSKAppToolbarCloudStatus', uLocalized('OLSKAppToolbarCloudStatusError'));
			});
		
		});
	
	});

	describe('OLSKCloud', function test_OLSKCloud() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute);
		});

		before(function () {
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchConnected');
		});

		before(function () {
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchOnline');
		});

		before(function () {
			return browser.pressButton('.OLSKAppToolbarStorageButton');
		});

		it('sets OLSKCloudStatusIdentityText', function () {
			browser.assert.text('.OLSKCloudStatusIdentity', 'ZDR_FAKE_CLOUD_IDENTITY');
		});

		context('sync start', function () {

			before(function () {
				browser.assert.elements('.OLSKCloudStatusSyncStartButton', 1);
				browser.assert.elements('.OLSKCloudStatusSyncStopButton', 0);
			});

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchSyncDidStart');
			});

			it('sets OLSKCloudStatusIsSyncing', function () {
				browser.assert.elements('.OLSKCloudStatusSyncStartButton', 0);
				browser.assert.elements('.OLSKCloudStatusSyncStopButton', 1);
			});
		
		});

		context('sync stop', function () {

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchSyncDidStop');
			});

			it('sets OLSKCloudStatusIsSyncing', function () {
				browser.assert.elements('.OLSKCloudStatusSyncStartButton', 1);
				browser.assert.elements('.OLSKCloudStatusSyncStopButton', 0);
			});
		
		});

		context('error', function () {

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchError');
			});

			it('sets OLSKCloudErrorText', function () {
				browser.assert.text('.OLSKCloudError', 'Error: ZDR_FAKE_CLOUD_ERROR');
			});
		
		});

		context('error', function () {

			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchError');
			});

			it('sets OLSKCloudErrorText', function () {
				browser.assert.text('.OLSKCloudError', 'Error: ZDR_FAKE_CLOUD_ERROR');
			});
		
		});

		context('disconnect', function () {

			before(function () {
				browser.assert.elements('.OLSKCloudForm', 0);
				browser.assert.elements('.OLSKCloudStatus', 1);
			});

			before(function () {
				return browser.pressButton('.OLSKCloudStatusDisconnectButton');
			});

			it('sets OLSKCloudErrorText', function () {
				browser.assert.elements('.OLSKCloudForm', 1);
				browser.assert.elements('.OLSKCloudStatus', 0);
			});
		
		});
	
	});

});
