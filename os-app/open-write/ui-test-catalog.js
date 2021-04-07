const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Catalog', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	context('create', function test_create () {
		
		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		it('adds item', function () {
			browser.assert.elements('.KVCWriteListItem', 1);
		});
	
	});

	context('OLSKCatalogDispatchClick', function test_OLSKCatalogDispatchClick () {
		
		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.elements('.KVCWriteDetail', 0);
		});

		before(function () {
			return browser.click('.KVCWriteListItem');
		});

		it('selects item', function () {
			browser.assert.elements('.KVCWriteDetail', 1);
		});
	
	});

	context('back', function test_back () {

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarBackButton');
		});

		it('sets focus', function () {
			browser.assert.hasClass('.OLSKCatalogDetail', 'OLSKMobileViewInactive');
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

			it('does nothing', function () {
				browser.assert.elements('.KVCWriteDetail', 1);
			});
		
		});

		context('confirm', function () {
			
			before(async function () {
				return browser.OLSKConfirm(function () {
					return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
				});
			});

			it('removes item', function () {
				browser.assert.elements('.KVCWriteListItem', 0);
			});
		
		});
		
	});

	context('OLSKCatalogDispatchArrow', function test_OLSKCatalogDispatchArrow () {
		
		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			return browser.focus('.OLSKMasterListFilterField');
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		it('binds OLSKCollectionItemsLocus', function () {
			browser.assert.hasClass('.OLSKResultsListItem:nth-child(2)', 'OLSKCollectionItemLocus');
		});
	
	});

	context('OLSKCatalogDispatchFilterSubmit', function test_OLSKCatalogDispatchFilterSubmit () {

		const item = Math.random().toString();
		
		before(function () {
			return browser.fill('.OLSKMasterListFilterField', item);
		});

		before(function () {
			return browser.fire('.OLSKMasterListForm', 'submit');
		});

		it('creates item', function () {
			browser.assert.text('.OLSKResultsListItem:nth-child(1)', item)
		});
	
	});

});
