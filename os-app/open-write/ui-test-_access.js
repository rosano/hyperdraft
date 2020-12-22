const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWrite: '.KVCWrite',

	KVCWriteViewportFooter: '.KVCWriteViewportFooter',
	
	KVCWriteStorageToolbar: '.KVCWriteStorageToolbar',
	KVCWriteStorageExportButton: '.KVCWriteStorageExportButton',
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

	it('shows KVCWriteMaster', function () {
		browser.assert.elements('.KVCWriteMaster', 1);
	});

	it('hides KVCWriteMasterListItem', function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});

	it('hides KVCWriteMasterRevealArchiveButton', function () {
		browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 0);
	});

	it('shows KVCWriteDetail', function () {
		browser.assert.elements('.KVCWriteDetail', 1);
	});

	it('shows OLSKDetailPlaceholder', function () {
		browser.assert.elements('.OLSKDetailPlaceholder', 1);
	});

	it('shows KVCWriteViewportFooter', function () {
		browser.assert.elements(KVCWriteViewportFooter, 1);
	});

	it('hides KVCWriteStorageToolbar', function () {
		browser.assert.elements(KVCWriteStorageToolbar, 0);
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

	it('shows OLSKAppToolbarFundButton', function () {
		browser.assert.elements('.OLSKAppToolbarFundButton', 1);
	});

	it('shows OLSKAppToolbarFundLimit', function () {
		browser.assert.elements('.OLSKAppToolbarFundLimit', 1);
	});

	it('shows OLSKAppToolbarLauncherButton', function () {
		browser.assert.elements('.OLSKAppToolbarLauncherButton', 1);
	});

	it('shows KVCWriteLauncherItemJournal', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemJournal', 1);
	});

	it('shows KVCWriteLauncherItemBacklinks', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemBacklinks', 1);
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

	describe('OLSKAppToolbarStorageButton', function test_OLSKAppToolbarStorageButton () {
		
		before(function () {
			return browser.pressButton('.OLSKAppToolbarStorageButton');
		});

		it('shows KVCWriteStorageToolbar', function () {
			browser.assert.elements(KVCWriteStorageToolbar, 1);
		});

		it('shows KVCWriteStorageExportButton', function () {
			browser.assert.elements(KVCWriteStorageExportButton, 1);
		});

		it('shows OLSKStorageWidget', function () {
			browser.assert.elements('.OLSKStorageWidget', 1);
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

	context('create', function test_create () {
		
		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		it('hides OLSKDetailPlaceholder', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});
	
	});

	context('back', function test_back () {
		
		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarBackButton');
		});

		// it('shows OLSKDetailPlaceholder', function () {
		// 	browser.assert.elements('.OLSKDetailPlaceholder', 1);
		// });
	
	});

	context('click', function test_click () {
		
		before(function () {
			return browser.click('.KVCWriteMasterListItem');
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		it('hides OLSKDetailPlaceholder', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});
	
	});

	context('discard', function test_discard () {

		context('cancel', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
				}, function (dialog) {
					dialog.response = false;

					return dialog;
				});
			});

			it('hides OLSKDetailPlaceholder', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 0);
			});
		
		});

		context('confirm', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
				});
			});

			it('hides KVCWriteMasterListItem', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 0);
			});

			it('shows OLSKDetailPlaceholder', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});
		
		});
		
	});

	context('archive', function test_archive () {
		
		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'alfa-archived');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarArchiveButton');
		});

		it('hides KVCWriteMasterRevealArchiveButton', function () {
			browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 0);
		});

		it('hides KVCWriteLauncherItemRevealArchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRevealArchive', 0);
		});

		context('clear_selection', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
			});

			it('shows KVCWriteMasterRevealArchiveButton', function () {
				browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 1);
			});

			it('shows KVCWriteLauncherItemRevealArchive', function () {
				return browser.assert.OLSKLauncherItems('KVCWriteLauncherItemRevealArchive', 1);
			});
		
		});

		context('filter', function () {

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
			});

			before(function () {
				browser.fill('.OLSKMasterListFilterField', 'a');
			});

			it('hides KVCWriteMasterRevealArchiveButton', function () {
				browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 0);
			});

			context('clear', function () {
				
				before(function () {
					return browser.pressButton('.OLSKInputWrapperClearButton');
				});

				it('shows KVCWriteMasterRevealArchiveButton', function () {
					browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 1);
				});
			
			});

		});

		context('discard_archived', function () {
			
			before(function () {
				return browser.pressButton('.KVCWriteMasterRevealArchiveButton');
			});

			before(function () {
				return browser.click('.KVCWriteMasterListItem');
			});

			before(async function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
				});
			});

			it('hides KVCWriteMasterRevealArchiveButton', function () {
				browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 0);
			});
		
		});

	});

	context('connected', function test_connected () {
		
		before(function () {
			return browser.OLSKLauncherRun('FakeStorageIsConnected');
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
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		it('shows KVCWriteDetailLauncherFakeItemProxy', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherFakeItemProxy', 1);
		});
	
	});

});
