const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWrite: '.KVCWrite',

	KVCWriteViewportFooter: '.KVCWriteViewportFooter',
	
	KVCWriteStorageToolbar: '.KVCWriteStorageToolbar',
	KVCWriteStorageExportButton: '.KVCWriteStorageExportButton',
	KVCWriteStorageWidget: '#KVCWriteStorageWidget',
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

	it('shows KVCWriteDetail', function () {
		browser.assert.elements('.KVCWriteDetail', 1);
	});

	it('shows OLSKDetailPlaceholder', function () {
		browser.assert.elements('.OLSKDetailPlaceholder', 1);
	});

	it('shows KVCWriteViewportFooter', function () {
		browser.assert.elements(KVCWriteViewportFooter, 1);
	});

	it('shows KVCWriteStorageToolbar', function () {
		browser.assert.elements(KVCWriteStorageToolbar, 1);
	});

	it('shows KVCWriteStorageExportButton', function () {
		browser.assert.elements(KVCWriteStorageExportButton, 1);
	});

	it('shows KVCWriteStorageWidget', function () {
		browser.assert.elements(KVCWriteStorageWidget, 1);
	});

	it('shows OLSKAppToolbar', function () {
		browser.assert.elements('.OLSKAppToolbar', 1);
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

});
