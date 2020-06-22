const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const kTesting = {
	uSerial (inputData) {
		return inputData.reduce(function (coll, e) {
			return coll.then(e);
		}, Promise.resolve());
	},
	uLaunch (inputData) {
		return kTesting.uSerial([
			function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			},
			function () {
				return browser.fill('.LCHLauncherFilterInput', inputData);
			},
			function () {
				return browser.click('.LCHLauncherResultListItem');
			},
		]);
	},
};

describe('KVCWrite_Sync', function () {	

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
		return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
	});

	describe('OLSKChangeDelegateCreateNote', function test_OLSKChangeDelegateCreateNote () {

		before(function () {
			browser.assert.elements('.OLSKResultsListItem', 1);
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
		});

		it('adds note', function () {
			browser.assert.elements('.OLSKResultsListItem', 2);
		});

		it('sorts list', function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateCreateNote alfa');
		});

		context('selected', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2)');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa2');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
			});

			it('adds note', function () {
				browser.assert.elements('.OLSKResultsListItem', 3);
			});

			it('skips sort', function () {
				browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateCreateNote FakeOLSKChangeDelegateCreateNote alfa2');
			});
		
		});

	});

	describe('OLSKChangeDelegateUpdateNote', function test_OLSKChangeDelegateUpdateNote () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateCreateNote alfa2 FakeOLSKChangeDelegateCreateNote');
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateUpdateNote');
		});

		it('updates note', function () {
			browser.assert.text('.OLSKResultsListItem:nth-child(1)', 'FakeOLSKChangeDelegateUpdateNote');
		});

		it('sorts list', function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateUpdateNote alfa2 FakeOLSKChangeDelegateCreateNote');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1)');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'bravo');
			});

			before(function () {
				// browser.assert.text('.OLSKResultsListItem', 'bravo alfa2 FakeOLSKChangeDelegateCreateNote');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateUpdateNote');
			});

			it('updates note', function () {
				browser.assert.elements('.OLSKResultsListItem:nth-child(3)', 'FakeOLSKChangeDelegateUpdateNote');
			});

			it('skips sort', function () {
				browser.assert.text('.OLSKResultsListItem', 'bravo alfa2 FakeOLSKChangeDelegateUpdateNote');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(3)');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'FakeOLSKChangeDelegateCreateNote');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateUpdateNote');
			});

			it('updates detail', function () {
				browser.assert.input('.KVCWriteInputFieldDebug', 'FakeOLSKChangeDelegateUpdateNote');
			});

		});

	});

	describe('OLSKChangeDelegateDeleteNote', function test_OLSKChangeDelegateDeleteNote () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateUpdateNote bravo alfa2');
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
		});

		before(function () {
			browser.assert.elements('.OLSKResultsListItem', 4);
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
		});

		it('removes note', function () {
			browser.assert.elements('.OLSKResultsListItem', 3);
		});

		it('sorts list', function () {
			browser.assert.text('.OLSKResultsListItem', 'FakeOLSKChangeDelegateCreateNote bravo alfa2');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(3)');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa3');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
			});

			it('removes note', function () {
				browser.assert.elements('.OLSKResultsListItem', 2);
			});

			it('skips sort', function () {
				browser.assert.text('.OLSKResultsListItem', 'bravo alfa3');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2)');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'FakeOLSKChangeDelegateCreateNote');
			});

			before(function () {
				// browser.assert.text('.OLSKResultsListItem', 'bravo OLSKChangeDelegateCreateNote');
			});

			before(function () {
				browser.assert.elements('.OLSKResultsListItem', 2);
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
			});

			it('removes note', function () {
				browser.assert.elements('.OLSKResultsListItem', 1);
			});

			it('clear detail', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});
		
		});

	});

});
