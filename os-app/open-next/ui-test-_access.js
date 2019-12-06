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

	it('shows WIKWriteDetail', function () {
		browser.assert.elements('.WIKWriteDetail', 1);
	});

	it('shows WIKWriteDetailPlaceholder', function () {
		browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
	});

	it('shows WKCWriteFooter', function () {
		browser.assert.elements('.WKCWriteFooter', 1);
	});

	it('shows WKCWriteStorageWidget', function () {
		browser.assert.elements(WKCWriteStorageWidget, 1);
	});

	context('create', function () {
		
		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		it('shows WKCWriteMasterListItem', function () {
			browser.assert.elements('.WKCWriteMasterListItem', 1);
		});

		it('hides WIKWriteDetailPlaceholder', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});
	
	});

	context('back', function () {
		
		before(function () {
			return browser.pressButton('.WIKWriteDetailToolbarBackButton');
		});

		it('shows WIKWriteDetailPlaceholder', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
		});
	
	});

	context('select', function () {
		
		before(function () {
			return browser.click('.WKCWriteMasterListItem');
		});

		it('shows WKCWriteMasterListItem', function () {
			browser.assert.elements('.WKCWriteMasterListItem', 1);
		});

		it('hides WIKWriteDetailPlaceholder', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});
	
	});

	context('delete', function () {

		context('cancel', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					browser.pressButton('.WIKWriteDetailToolbarDiscardButton');
				}, function (dialog) {
					dialog.response = false;

					return dialog;
				});
			});

			it('hides WIKWriteDetailPlaceholder', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
			});
		
		});

		context('confirm', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.WIKWriteDetailToolbarDiscardButton');
				});
			});

			it('hides WKCWriteMasterListItem', function () {
				browser.assert.elements('.WKCWriteMasterListItem', 0);
			});

			it('shows WIKWriteDetailPlaceholder', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
			});
		
		});
		
	});

});
