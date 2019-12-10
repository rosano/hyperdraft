import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteStorageWidget: '#WKCWriteStorageWidget',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWrite_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WKCWriteMaster', function () {
		browser.assert.elements('.WKCWriteMaster', 1);
	});

	it('hides WKCWriteMasterListItem', function () {
		browser.assert.elements('.WKCWriteMasterListItem', 0);
	});

	it('shows WKCWriteDetail', function () {
		browser.assert.elements('.WKCWriteDetail', 1);
	});

	it('shows WKCWriteDetailPlaceholder', function () {
		browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
	});

	it('shows WKCWriteFooter', function () {
		browser.assert.elements('.WKCWriteFooter', 1);
	});

	it('shows WKCWriteStorageWidget', function () {
		browser.assert.elements(WKCWriteStorageWidget, 1);
	});

	context('create', function test_create () {
		
		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		it('shows WKCWriteMasterListItem', function () {
			browser.assert.elements('.WKCWriteMasterListItem', 1);
		});

		it('hides WKCWriteDetailPlaceholder', function () {
			browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
		});
	
	});

	context('back', function test_back () {
		
		before(function () {
			return browser.pressButton('.WKCWriteDetailToolbarBackButton');
		});

		// it('shows WKCWriteDetailPlaceholder', function () {
		// 	browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
		// });
	
	});

	context('click', function test_click () {
		
		before(function () {
			return browser.click('.WKCWriteMasterListItem');
		});

		it('shows WKCWriteMasterListItem', function () {
			browser.assert.elements('.WKCWriteMasterListItem', 1);
		});

		it('hides WKCWriteDetailPlaceholder', function () {
			browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
		});
	
	});

	context('discard', function test_discard () {

		context('cancel', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					browser.pressButton('.WKCWriteDetailToolbarDiscardButton');
				}, function (dialog) {
					dialog.response = false;

					return dialog;
				});
			});

			it('hides WKCWriteDetailPlaceholder', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
			});
		
		});

		context('confirm', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.WKCWriteDetailToolbarDiscardButton');
				});
			});

			it('hides WKCWriteMasterListItem', function () {
				browser.assert.elements('.WKCWriteMasterListItem', 0);
			});

			it('shows WKCWriteDetailPlaceholder', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
			});
		
		});
		
	});

});
