import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteMaster_Misc', function () {

	describe('KVCWriteMaster', function test_KVCWriteMaster () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('classes OLSKViewportMaster', function () {
			browser.assert.hasClass(KVCWriteMaster, 'OLSKViewportMaster');
		});

		context('blur KVCWriteMasterFilterField', function() {

			before(function () {
				browser.assert.hasClass(KVCWriteMaster, 'KVCWriteMasterFocused')
			});

			before(function () {
				browser.click(KVCWriteMasterCreateButton);
			});
			
			it.skip('classes KVCWriteMasterFocused', function() {
				browser.assert.hasNoClass(KVCWriteMaster, 'KVCWriteMasterFocused');
			});

		});

		context('focus KVCWriteMasterFilterField', function() {

			before(function () {
				return browser.click(KVCWriteMasterFilterField);
			});
			
			it('classes KVCWriteMasterFocused', function() {
				browser.assert.hasClass(KVCWriteMaster, 'KVCWriteMasterFocused');
			});

		});

		context('OLSKMobileViewInactive', function () {

			before(function () {
				browser.assert.hasNoClass(KVCWriteMaster, 'OLSKMobileViewInactive');
			});

			before(function () {
				browser.assert.attribute(KVCWriteMaster, 'aria-hidden', null);
			});
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKMobileViewInactive: true,
				});
			});

			it('classes OLSKMobileViewInactive', function () {
				browser.assert.hasClass(KVCWriteMaster, 'OLSKMobileViewInactive');
			});

			it('sets aria-hidden', function () {
				browser.assert.attribute(KVCWriteMaster, 'aria-hidden', 'true');
			});
		
		});

		context('OLSKResultsDispatchArrow', function () {

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
						KVCNoteID: 'charlie',
						KVCNoteBody: 'delta',
					}),
				});
			});

			context('keydown ArrowUp', function() {

				before(function () {
					return browser.query('.KVCWriteMasterFilterField').focus();
				});
				
				before(function () {
					browser.assert.text('#TestKVCWriteMasterDispatchArrow', '0');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowUp');
				});

				it('sends KVCWriteMasterDispatchArrow', function () {
					browser.assert.text('#TestKVCWriteMasterDispatchArrow', '1');
					browser.assert.text('#TestKVCWriteMasterDispatchArrowData', JSON.stringify({
						KVCNoteID: 'alfa',
						KVCNoteBody: 'bravo',
					}));
				});

			});
		
		});
	
	});

	describe('KVCWriteMasterToolbar', function test_KVCWriteMasterToolbar () {
		
		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(KVCWriteMasterToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('KVCWriteMasterFilterField', function test_KVCWriteMasterFilterField() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterFilterText: 'alfa',
			});
		});

		it('binds KVCWriteMasterFilterText', function () {
			browser.assert.input(KVCWriteMasterFilterField, 'alfa');
		});

		it('sets InputWrapperValue', function () {
			browser.assert.elements('.OLSKInputWrapperClearButton', 1);
		});
			
		context('input', function () {
		
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchFilter', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchFilterData', 'undefined');
			});

			before(function () {
				browser.fill(KVCWriteMasterFilterField, 'bravo');
			});

			it('sends KVCWriteMasterDispatchFilter', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchFilter', '1');
				browser.assert.text('#TestKVCWriteMasterDispatchFilterData', 'bravo');
			});
		
		});

		context('clear', function () {

			before(function () {
				return browser.pressButton('.OLSKInputWrapperClearButton');
			});

			it('sends KVCWriteMasterDispatchFilter', function () {
				browser.assert.text('#TestKVCWriteMasterDispatchFilter', '2');
				browser.assert.text('#TestKVCWriteMasterDispatchFilterData', '');
			});
		
		});

		context('keydown Enter', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteMasterDispatchCreate', '0');
				browser.assert.text('#TestKVCWriteMasterDispatchCreateData', 'undefined');
			});
			
			context('input empty', function () {
				
				before(function () {
					browser.fill(KVCWriteMasterFilterField, ' ');
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
					browser.fill(KVCWriteMasterFilterField, 'bravo');
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
					browser.fill(KVCWriteMasterFilterField, 'bravo');
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

	describe('KVCWriteMasterCreateButton', function test_KVCWriteMasterCreateButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteMasterCreateButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteMasterCreateButton, 'OLSKLayoutElementTappable');
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

	describe('KVCWriteMasterBody', function test_KVCWriteMasterBody () {
		
		it('classes OLSKMobileViewBody', function () {
			browser.assert.hasClass(KVCWriteMasterBody, 'OLSKMobileViewBody');
		});
	
	});

	describe('KVCWriteMasterListItem', function test_KVCWriteMasterListItem() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteID: 'alfa',
					KVCNoteBody: 'bravo\ncharlie',
				}]),
			});
		});

		it('sets KVCWriteMasterListItemAccessibilitySummary', function () {
			browser.assert.text('.KVCWriteMasterListItemAccessibilitySummary', 'bravo');
		});

		it('sets KVCWriteMasterListItemTitle', function () {
			browser.assert.text('.KVCWriteMasterListItemTitle', 'bravo');
		});

		it('sets KVCWriteMasterListItemSnippet', function () {
			browser.assert.text('.KVCWriteMasterListItemSnippet', 'charlie');
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
					KVCNoteBody: 'bravo\ncharlie',
				}));
			});
		
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
			browser.assert.hasClass(`.OLSKResultsListItem:nth-child(2)`, 'OLSKResultsListItemSelected');
		});
		
	});

});
