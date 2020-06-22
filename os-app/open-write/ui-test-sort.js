const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Sort', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'alfa');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'bravo');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		browser.fill('.KVCWriteInputFieldDebug', 'charlie');
	});

	describe('update', function test_update () {

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(3)');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'alfa2');
		});

		it('skips sort', function () {
			browser.assert.text('.OLSKResultsListItem', 'charlie bravo alfa2');
		});

	});

	describe('unselect', function test_unselect () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		it('sorts list', function () {
			browser.assert.text('.OLSKResultsListItem', 'alfa2 charlie bravo');
		});

	});

	describe('delete', function test_delete () {

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(3)');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'bravo2');
		});

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(2)');
		});

		before(async function () {
			return browser.OLSKConfirm(function () {
				return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
			});
		});

		it('skips sort', function () {
			browser.assert.text('.OLSKResultsListItem', 'alfa2 bravo2');
		});

	});

});
