const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Archive', function () {	

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		return browser.fill('.KVCWriteInputFieldDebug', 'alfa');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		return browser.fill('.KVCWriteInputFieldDebug', 'bravo');
	});

	before(function () {
		return browser.pressButton('.KVCWriteMasterCreateButton');
	});

	before(function () {
		return browser.fill('.KVCWriteInputFieldDebug', 'charlie');
	});

	before(function () {
		return browser.click('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem');
	});

	before(function () {
		return browser.fill('.KVCWriteInputFieldDebug', 'alfa2');
	});

	describe('archive', function test_archive () {

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'charlie2');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarArchiveButton');
		});

		it('skips sort', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'charlie2 bravo alfa2');
		});

	});

	describe('deselect', function test_deselect () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		it('hides archived', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo');
		});

	});

	describe('reveal', function test_reveal () {

		before(function () {
			return browser.pressButton('.KVCWriteMasterRevealArchiveButton');
		});

		it('sorts below others', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo charlie2');
		});

	});

	describe('escape', function test_escape () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		it('hides archived', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo');
		});

	});

	context('filter', function test_filter () {

		before(function () {
			browser.fill('.OLSKMasterListFilterField', 'a');
		});

		it('shows archived', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo charlie2');
		});

		context('clear', function () {
			
			before(function () {
				return browser.pressButton('.OLSKInputWrapperClearButton');
			});

			it('hides archived', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo');
			});
		
		});

	});

	describe('unarchive', function test_unarchive () {

		before(function () {
			return uLaunch('KVCWriteLauncherItemRevealArchive');
		});

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'charlie3');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarUnarchiveButton');
		});

		it('skips sort', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'alfa2 bravo charlie3');
		});

	});

	describe('deselect', function test_deselect () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		it('sorts below others', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'charlie3 alfa2 bravo');
		});

	});

});
