import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteStorageWidget: '#KVCWriteStorageWidget',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWrite_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
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

	it('shows KVCWriteDetailPlaceholder', function () {
		browser.assert.elements('.KVCWriteDetailPlaceholder', 1);
	});

	it('shows KVCWriteFooter', function () {
		browser.assert.elements('.KVCWriteFooter', 1);
	});

	it('shows KVCWriteStorageWidget', function () {
		browser.assert.elements(KVCWriteStorageWidget, 1);
	});

	context('create', function test_create () {
		
		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		it('hides KVCWriteDetailPlaceholder', function () {
			browser.assert.elements('.KVCWriteDetailPlaceholder', 0);
		});
	
	});

	context('back', function test_back () {
		
		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarBackButton');
		});

		// it('shows KVCWriteDetailPlaceholder', function () {
		// 	browser.assert.elements('.KVCWriteDetailPlaceholder', 1);
		// });
	
	});

	context('click', function test_click () {
		
		before(function () {
			return browser.click('.KVCWriteMasterListItem');
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		it('hides KVCWriteDetailPlaceholder', function () {
			browser.assert.elements('.KVCWriteDetailPlaceholder', 0);
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

			it('hides KVCWriteDetailPlaceholder', function () {
				browser.assert.elements('.KVCWriteDetailPlaceholder', 0);
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

			it('shows KVCWriteDetailPlaceholder', function () {
				browser.assert.elements('.KVCWriteDetailPlaceholder', 1);
			});
		
		});
		
	});

});
