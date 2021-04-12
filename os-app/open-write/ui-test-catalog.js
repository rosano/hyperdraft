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

	context('OLSKCollectionDispatchClick', function test_OLSKCollectionDispatchClick () {
		
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

	context('OLSKCollectionDispatchArrow', function test_OLSKCollectionDispatchArrow () {
		
		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		before(function () {
			return browser.focus('.OLSKNarrowFilterField');
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		it('binds OLSKCollectionItemsLocus', function () {
			browser.assert.hasClass('.OLSKCollectionItem:nth-child(2)', 'OLSKCollectionItemLocus');
		});
	
	});

	context('OLSKCatalogDispatchFilterSubmit', function test_OLSKCatalogDispatchFilterSubmit () {

		const item = Math.random().toString();
		
		before(function () {
			return browser.fill('.OLSKNarrowFilterField', item);
		});

		before(function () {
			return browser.fire('.OLSKNarrowForm', 'submit');
		});

		it('creates item', function () {
			browser.assert.text('.OLSKCollectionItem:nth-child(1)', item)
		});
	
	});

});
