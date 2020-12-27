const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMaster_Misc', function () {
		
	describe('KVCWriteMaster', function test_KVCWriteMaster() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		context.skip('keydown Enter', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchCreate', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchCreateData', 'undefined');
			});

			context('input empty', function () {
				
				before(function () {
					browser.fill('.OLSKMasterListFilterField', ' ');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends no KVCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestKVCWriteMasterDispatchCreate', '0');
				});
			
			});

			context('input not empty', function () {
				
				before(function () {
					browser.fill('.OLSKMasterListFilterField', 'bravo');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends KVCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestKVCWriteMasterDispatchCreate', '1');
					browser.assert.text('#TestKVCWriteMasterDispatchCreateData', 'bravo');
				});
			
			});

			context('input identical to selected', function () {

				before(function () {
					return browser.OLSKVisit(kDefaultRoute, {
						KVCWriteMasterListItems: JSON.stringify([{
							KVCNoteID: 'alfa',
							KVCNoteBody: 'bravo',
						}]),
						KVCWriteMasterListItemSelected: JSON.stringify({
							KVCNoteID: 'alfa',
							KVCNoteBody: 'bravo',
						}),
					});
				});
				
				before(function () {
					browser.fill('.OLSKMasterListFilterField', 'bravo');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends KVCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestKVCWriteMasterDispatchCreate', '0');
				});
			
			});
		
		});

	});

	describe('OLSKMasterList', function test_OLSKMasterList() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo',
				}, {
					KVCNoteID: 'charlie',
					KVCNoteBody: 'delta',
				}, {
					KVCNoteID: 'echo',
					KVCNoteBody: 'foxtrot',
				}]),
				KVCWriteMasterListItemSelected: JSON.stringify({
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo',
				}),
				KVCWriteMasterFilterText: 'alfa',
			});
		});

		it('binds OLSKMasterListFilterText', function () {
			browser.assert.input('.OLSKMasterListFilterField', 'alfa');
		});

		it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
			browser.assert.attribute('.OLSKResultsListItem:nth-child(1) .OLSKMasterListItem', 'aria-label', 'bravo');
		});

		it('sets OLSKMasterListItemSelected', function () {
			browser.assert.hasClass('.OLSKResultsListItem:nth-child(1)', 'OLSKResultsListItemSelected');
		});

		context('input', function () {
		
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchFilter', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchFilterData', 'undefined');
			});

			before(function () {
				browser.fill('.OLSKMasterListFilterField', 'charlie');
			});

			it('sends KVCWriteMasterDispatchFilter', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchFilter', '1');
				browser.assert.text('#TestKVCWriteMasterDispatchFilterData', 'charlie');
			});
		
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchClick', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchClickData', 'undefined');
			});
			
			before(function () {
				return browser.click('.KVCWriteMasterListItem');
			});

			it('sends KVCWriteMasterDispatchClick', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchClick', '1');
				browser.assert.text('#TestKVCWriteMasterDispatchClickData', JSON.stringify({
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo',
				}));
			});
		
		});

	});

	describe('KVCWriteMasterCreateButton', function test_KVCWriteMasterCreateButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteMasterCreateButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteMasterCreateButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteMasterCreateButton, 'OLSKToolbarButton');
		});
		
		it('sets accesskey', function () {
			browser.assert.attribute(KVCWriteMasterCreateButton, 'accesskey', 'n');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchCreate', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteMasterCreateButton);
			});

			it('sends KVCWriteMasterDispatchCreate', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchCreate', '1');
			});
		
		});
	
	});

	describe('KVCWriteMasterCreateButtonImage', function test_KVCWriteMasterCreateButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteMasterCreateButtonImage } #_OLSKSharedCreate`, 1);
		});
	
	});

	describe('OLSKMasterListItem', function test_OLSKMasterListItem() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo\ncharlie',
				}]),
			});
		});

		it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
			browser.assert.attribute('.OLSKMasterListItem', 'aria-label', 'bravo');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchClick', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchClickData', 'undefined');
			});
			
			before(function () {
				return browser.click('.OLSKMasterListItem');
			});

			it('sends KVCWriteMasterDispatchClick', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchClick', '1');
				browser.assert.text('#TestKVCWriteMasterDispatchClickData', JSON.stringify({
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo\ncharlie',
				}));
			});
		
		});
		
	});

	describe('KVCWriteMasterListItem', function test_KVCWriteMasterListItem() {
		
		it('sets KVCWriteMasterListItemTitle', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', 'bravo');
		});

		it('sets KVCWriteMasterListItemSnippet', function () {
			browser.assert.text('.KVCWriteMasterListItemSnippet', 'charlie');
		});
		
	});

	describe('KVCWriteMasterListItemSelected', function test_KVCWriteMasterListItemSelected() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo',
				}, {
					KVCNoteID: 'charlie',
					KVCNoteBody: 'delta',
				}]),
				KVCWriteMasterListItemSelected: JSON.stringify({
					KVCNoteID: 'charlie',
					KVCNoteBody: 'delta',
				}),
			});
		});

		it('sets OLSKResultsListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
			browser.assert.hasClass('.OLSKResultsListItem:nth-child(2)', 'OLSKResultsListItemSelected');
		});
		
	});

	describe('KVCWriteMasterRevealArchiveButton', function test_KVCWriteMasterRevealArchiveButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([]),
				KVCWriteMasterRevealArchiveIsVisible: true,
			});
		});

		it('classes OLSKDecorPress', function () {
			browser.assert.hasClass(KVCWriteMasterRevealArchiveButton, 'OLSKDecorPress');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchRevealArchive', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteMasterRevealArchiveButton);
			});

			it('sends KVCWriteMasterDispatchRevealArchive', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchRevealArchive', '1');
			});
		
		});
		
	});

});
