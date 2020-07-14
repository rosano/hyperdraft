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

	it('shows OLSKAppToolbarLauncherButton', function () {
		browser.assert.elements('.OLSKAppToolbarLauncherButton', 1);
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
			browser.assert.elements(KVCWriteMasterRevealArchiveButton, 0);
		});

		context('clear_selection', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
			});

			it('shows KVCWriteMasterRevealArchiveButton', function () {
				browser.assert.elements('.KVCWriteMasterRevealArchiveButton', 1);
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
				browser.assert.elements(KVCWriteMasterRevealArchiveButton, 0);
			});

			context('clear', function () {
				
				before(function () {
					return browser.pressButton('.OLSKInputWrapperClearButton');
				});

				it('shows KVCWriteMasterRevealArchiveButton', function () {
					browser.assert.elements(KVCWriteMasterRevealArchiveButton, 1);
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
				browser.assert.elements(KVCWriteMasterRevealArchiveButton, 0);
			});
		
		});

	});

	describe('KVCWriteLauncherItemJournal', function test_KVCWriteLauncherItemJournal() {
		
		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemJournal');
		});

		it('shows LCHLauncherPipeItem', function () {
			browser.assert.elements('.LCHLauncherPipeItem', 1);
		});

	});

	describe('KVCWriteLauncherItemConfigureCustomDomain', function test_KVCWriteLauncherItemConfigureCustomDomain() {
		
		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemConfigureCustomDomain');
		});

		it('hides LCHLauncherPipeItem', function () {
			browser.assert.elements('.LCHLauncherPipeItem', 0);
		});

		context('connected', function () {
			
			before(function () {
				return uLaunch('FakeStorageIsConnected');
			});

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			before(function () {
				return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemConfigureCustomDomain');
			});

			it('shows LCHLauncherPipeItem', function () {
				browser.assert.elements('.LCHLauncherPipeItem', 1);
			});
		
		});

	});

	describe('KVCWriteLauncherItemRemoveCustomDomain', function test_KVCWriteLauncherItemRemoveCustomDomain() {
		
		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemRemoveCustomDomain');
		});

		it('hides LCHLauncherPipeItem', function () {
			browser.assert.elements('.LCHLauncherPipeItem', 0);
		});

		context('set_domain', function () {
			
			before(function () {
				return uLaunch('FakeConfigureCustomDomain');
			});

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			before(function () {
				return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemRemoveCustomDomain');
			});

			it('shows LCHLauncherPipeItem', function () {
				browser.assert.elements('.LCHLauncherPipeItem', 1);
			});
		
		});

	});

	describe('KVCWriteDetailLauncherFakeItemProxy', function test_KVCWriteDetailLauncherFakeItemProxy() {
		
		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteDetailLauncherFakeItemProxy');
		});

		it('hides LCHLauncherPipeItem', function () {
			browser.assert.elements('.LCHLauncherPipeItem', 0);
		});

		context('select', function () {
			
			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			before(function () {
				return browser.fill('.LCHLauncherFilterInput', 'KVCWriteDetailLauncherFakeItemProxy');
			});

			it('shows LCHLauncherPipeItem', function () {
				browser.assert.elements('.LCHLauncherPipeItem', 1);
			});
		
		});

	});

});
