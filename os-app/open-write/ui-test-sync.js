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
		return browser.fill('.KVCWriteInputFieldDebug', 'alfa');
	});

	before(function () {
		return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
	});

	describe('OLSKChangeDelegateCreateNote', function test_OLSKChangeDelegateCreateNote () {

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
		});

		it('adds note', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 2);
		});

		it('sorts list', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateCreateNote alfa');
		});

		context('selected', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'alfa2');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
			});

			it('adds note', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateCreateNote FakeOLSKChangeDelegateCreateNote alfa2');
			});
		
		});

	});

	describe('OLSKChangeDelegateUpdateNote', function test_OLSKChangeDelegateUpdateNote () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateCreateNote alfa2 FakeOLSKChangeDelegateCreateNote');
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateUpdateNote');
		});

		it('updates note', function () {
			browser.assert.text('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem', 'FakeOLSKChangeDelegateUpdateNote');
		});

		it('sorts list', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateUpdateNote FakeOLSKChangeDelegateCreateNote alfa2');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'bravo');
			});

			before(function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeOLSKChangeDelegateCreateNote alfa2');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateUpdateNote');
			});

			it('updates note', function () {
				browser.assert.elements('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem', 'FakeOLSKChangeDelegateUpdateNote');
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeOLSKChangeDelegateUpdateNote alfa2');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'FakeOLSKChangeDelegateCreateNote');
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
			return browser.click('.OLSKResultsListItem:nth-child(3) .KVCWriteMasterListItem');
		});

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', 'alfa3');
		});

		before(function () {
			return kTesting.uLaunch('FakeEscapeWithoutSort');
		});

		before(function () {
			browser.assert.text('.KVCWriteMasterListItem', 'bravo FakeOLSKChangeDelegateUpdateNote alfa3');
		});

		before(function () {
			browser.assert.elements('.KVCWriteMasterListItem', 3);
		});

		before(function () {
			return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
		});

		it('removes note', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 2);
		});

		it('skips sort', function () {
			browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa3');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KVCWriteMasterListItem');
			});

			before(function () {
				return browser.fill('.KVCWriteInputFieldDebug', 'alfa4');
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
			});

			before(function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
			});

			it('removes note', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa4');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateCreateNote');
			});

			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItem');
			});

			before(function () {
				// browser.assert.text('.KVCWriteMasterListItem', 'FakeOLSKChangeDelegateCreateNote bravo alfa4');
			});

			before(function () {
				browser.assert.elements('.KVCWriteMasterListItem', 3);
			});

			before(function () {
				return kTesting.uLaunch('FakeOLSKChangeDelegateDeleteNote');
			});

			it('removes note', function () {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('clear detail', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});

			it('skips sort', function () {
				browser.assert.text('.KVCWriteMasterListItem', 'bravo alfa4');
			});
		
		});

	});

});
