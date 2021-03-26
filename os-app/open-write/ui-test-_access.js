const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWrite: '.KVCWrite',
	
	KVCWriteCreateButton: '.KVCWriteCreateButton',
	KVCWriteCreateButtonImage: '.KVCWriteCreateButtonImage',

	KVCWriteRevealArchiveButton: '.KVCWriteRevealArchiveButton',

	KVCWriteViewportFooter: '.KVCWriteViewportFooter',
	
	KVCWriteCloudToolbar: '.KVCWriteCloudToolbar',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWrite_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWrite', function () {
		browser.assert.elements(KVCWrite, 1);
	});

	it('shows OLSKCatalog', function () {
		browser.assert.elements('.OLSKCatalog', 1);
	});

	it('shows KVCWriteCreateButton', function () {
		browser.assert.elements(KVCWriteCreateButton, 1);
	});

	it('shows KVCWriteCreateButtonImage', function () {
		browser.assert.elements(KVCWriteCreateButtonImage, 1);
	});

	it('hides KVCWriteListItem', function () {
		browser.assert.elements('.KVCWriteListItem', 0);
	});

	it('hides KVCWriteRevealArchiveButton', function () {
		browser.assert.elements('.KVCWriteRevealArchiveButton', 0);
	});

	it('shows KVCWriteViewportFooter', function () {
		browser.assert.elements(KVCWriteViewportFooter, 1);
	});

	it('hides KVCWriteCloudToolbar', function () {
		browser.assert.elements(KVCWriteCloudToolbar, 0);
	});

	it('shows OLSKAppToolbar', function () {
		browser.assert.elements('.OLSKAppToolbar', 1);
	});

	it('shows OLSKAppToolbarAproposButton', function () {
		browser.assert.elements('.OLSKAppToolbarAproposButton', 1);
	});

	it('shows OLSKAppToolbarLanguageButton', function () {
		browser.assert.elements('.OLSKAppToolbarLanguageButton', 1);
	});

	it('shows OLSKAppToolbarGuideLink', function () {
		browser.assert.elements('.OLSKAppToolbarGuideLink', 1);
	});

	it('shows OLSKAppToolbarFundButton', function () {
		browser.assert.elements('.OLSKAppToolbarFundButton', 1);
	});

	it('shows OLSKAppToolbarFundLimit', function () {
		browser.assert.elements('.OLSKAppToolbarFundLimit', 1);
	});

	it('shows OLSKAppToolbarLauncherButton', function () {
		browser.assert.elements('.OLSKAppToolbarLauncherButton', 1);
	});

	it('shows OLSKInstall', function () {
		browser.assert.elements('.OLSKInstall', 1);
	});

	it('shows KVCWriteLauncherItemJournal', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemJournal', 1);
	});

	it('shows KVCWriteLauncherItemBacklinks', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemBacklinks', 1);
	});

	it('shows KVCWriteLauncherItemShowPublicNotes', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemShowPublicNotes', 1);
	});

	it('shows ZDRLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('ZDRLauncherFakeItemProxy', 1);
	});

	it('shows OLSKRemoteStorageLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('OLSKRemoteStorageLauncherFakeItemProxy', 1);
	});

	it('shows OLSKServiceWorkerLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('OLSKServiceWorkerLauncherFakeItemProxy', 1);
	});

	it('hides KVCWriteLauncherItemConfigureCustomDomain', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemConfigureCustomDomain', 0);
	});

	it('hides KVCWriteLauncherItemRemoveCustomDomain', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRemoveCustomDomain', 0);
	});

	it('hides KVCWriteDetailLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherFakeItemProxy', 0);
	});

	it('hides KVCWriteLauncherItemRevealArchive', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRevealArchive', 0);
	});

	it('shows KVCWriteLauncherItemImportJSON', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemImportJSON', 1);
	});

	it('shows KVCWriteLauncherItemImportTXT', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemImportTXT', 1);
	});

	it('shows KVCWriteLauncherItemImportNV', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemImportNV', 1);
	});

	it('shows KVCWriteLauncherItemExportJSON', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemExportJSON', 1);
	});

	it('shows KVCWriteLauncherItemExportZIP', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemExportZIP', 1);
	});

	describe('tongue', function test_tongue() {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLanguageButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'OLSKLanguageSwitcherLauncherFakeItemProxy');
		});

		it('shows OLSKLanguageSwitcherLauncherFakeItemProxy', function () {
			browser.assert.elements('.LCHLauncherPipeItem', 1);
		});

		after(function () {
			browser.pressButton('#TestLCHDebugCloseButton');
		});

	});

	describe('OLSKAppToolbarCloudButton', function test_OLSKAppToolbarCloudButton () {
		
		before(function () {
			return browser.pressButton('.OLSKAppToolbarCloudButton');
		});

		it('shows KVCWriteCloudToolbar', function () {
			browser.assert.elements(KVCWriteCloudToolbar, 1);
		});

		it('shows OLSKCloud', function () {
			browser.assert.elements('.OLSKCloud', 1);
		});
	
	});

	describe('OLSKAppToolbarLauncherButton', function test_OLSKAppToolbarLauncherButton () {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		it('shows LCHLauncher', function() {
			browser.assert.elements('.LCHLauncher', 1);
		});

		context('AltSpace', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Space', {
					altKey: true,
				});
			});
			
			it('hides LCHLauncher', function () {
				browser.assert.elements('.LCHLauncher', 0);
			});

		});

	}); 

	context('archive', function test_archive () {
		
		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'alfa-archived');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarArchiveButton');
		});

		it('hides KVCWriteRevealArchiveButton', function () {
			browser.assert.elements('.KVCWriteRevealArchiveButton', 0);
		});

		it('hides KVCWriteLauncherItemRevealArchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRevealArchive', 0);
		});

		context('clear_selection', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
			});

			it('shows KVCWriteRevealArchiveButton', function () {
				browser.assert.elements('.KVCWriteRevealArchiveButton', 1);
			});

			it('shows KVCWriteLauncherItemRevealArchive', function () {
				return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRevealArchive', 1);
			});
		
		});

	});

	context('connected', function test_connected () {
		
		before(function () {
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchConnected');
		});

		it('shows KVCWriteLauncherItemConfigureCustomDomain', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemConfigureCustomDomain', 1);
		});
	
	});

	context('set_domain', function test_set_domain() {
		
		before(function () {
			return browser.OLSKLauncherRun('FakeConfigureCustomDomain');
		});

		it('shows KVCWriteLauncherItemRemoveCustomDomain', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRemoveCustomDomain', 1);
		});
	
	});

	context('select', function test_select() {
		
		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		it('shows KVCWriteDetailLauncherFakeItemProxy', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherFakeItemProxy', 1);
		});
	
	});

});
