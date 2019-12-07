import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteMaster_Misc', function () {

	describe('WKCWriteMaster', function test_WKCWriteMaster () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('classes OLSKViewportMaster', function () {
			browser.assert.hasClass(WKCWriteMaster, 'OLSKViewportMaster');
		});

		context('blur WKCWriteMasterFilterField', function() {

			before(function () {
				browser.assert.hasClass(WKCWriteMaster, 'WKCWriteMasterFocused')
			});

			before(function () {
				browser.click(WKCWriteMasterCreateButton);
			});
			
			it.skip('classes WKCWriteMasterFocused', function() {
				browser.assert.hasNoClass(WKCWriteMaster, 'WKCWriteMasterFocused');
			});

		});

		context('focus WKCWriteMasterFilterField', function() {

			before(function () {
				return browser.click(WKCWriteMasterFilterField);
			});
			
			it('classes WKCWriteMasterFocused', function() {
				browser.assert.hasClass(WKCWriteMaster, 'WKCWriteMasterFocused');
			});

		});

		context('OLSKMobileViewInactive', function () {

			before(function () {
				browser.assert.hasNoClass(WKCWriteMaster, 'OLSKMobileViewInactive');
			});
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKMobileViewInactive: true,
				});
			});

			it('classes OLSKMobileViewInactive', function () {
				browser.assert.hasClass(WKCWriteMaster, 'OLSKMobileViewInactive');
			});
		
		});

		context('OLSKResultsDispatchArrow', function () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					WKCWriteMasterListItems: JSON.stringify([{
						WKCDocumentID: 'alfa',
						WKCNoteBody: 'bravo',
					}, {
						WKCDocumentID: 'charlie',
						WKCNoteBody: 'delta',
					}, {
						WKCDocumentID: 'echo',
						WKCNoteBody: 'foxtrot',
					}]),
					WKCWriteMasterListItemSelected: JSON.stringify({
						WKCDocumentID: 'charlie',
						WKCNoteBody: 'delta',
					}),
				});
			});

			context('keydown ArrowUp', function() {

				before(function () {
					browser.assert.text('#TestWKCWriteMasterDispatchArrow', '0');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowUp');
				});

				it('sends WKCWriteMasterDispatchArrow', function () {
					browser.assert.text('#TestWKCWriteMasterDispatchArrow', '1');
					browser.assert.text('#TestWKCWriteMasterDispatchArrowData', JSON.stringify({
						WKCDocumentID: 'alfa',
						WKCNoteBody: 'bravo',
					}));
				});

			});
		
		});
	
	});

	describe('WKCWriteMasterToolbar', function test_WKCWriteMasterToolbar () {
		
		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(WKCWriteMasterToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('WKCWriteMasterFilterField', function test_WKCWriteMasterFilterField() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterFilterText: 'alfa',
			});
		});

		it('binds WKCWriteMasterFilterText', function () {
			browser.assert.input(WKCWriteMasterFilterField, 'alfa');
		});

		it('sets InputWrapperValue', function () {
			browser.assert.elements('.OLSKInputWrapperClearButton', 1);
		});
			
		context('input', function () {
		
			before(function () {
				browser.assert.text('#TestWKCWriteMasterDispatchFilter', '0');
				browser.assert.text('#TestWKCWriteMasterDispatchFilterData', 'undefined');
			});

			before(function () {
				browser.fill(WKCWriteMasterFilterField, 'bravo');
			});

			it('sends WKCWriteMasterDispatchFilter', function () {
				browser.assert.text('#TestWKCWriteMasterDispatchFilter', '1');
				browser.assert.text('#TestWKCWriteMasterDispatchFilterData', 'bravo');
			});
		
		});

		context('clear', function () {

			before(function () {
				return browser.pressButton('.OLSKInputWrapperClearButton');
			});

			it('sends WKCWriteMasterDispatchFilter', function () {
				browser.assert.text('#TestWKCWriteMasterDispatchFilter', '2');
				browser.assert.text('#TestWKCWriteMasterDispatchFilterData', '');
			});
		
		});

		context('keydown Enter', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteMasterDispatchCreate', '0');
				browser.assert.text('#TestWKCWriteMasterDispatchCreateData', 'undefined');
			});
			
			context('input empty', function () {
				
				before(function () {
					browser.fill(WKCWriteMasterFilterField, ' ');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends no WKCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestWKCWriteMasterDispatchCreate', '0');
				});
			
			});

			context('input not empty', function () {
				
				before(function () {
					browser.fill(WKCWriteMasterFilterField, 'bravo');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends WKCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestWKCWriteMasterDispatchCreate', '1');
					browser.assert.text('#TestWKCWriteMasterDispatchCreateData', 'bravo');
				});
			
			});

			context('input identical to selected', function () {

				before(function () {
					return browser.OLSKVisit(kDefaultRoute, {
						WKCWriteMasterListItems: JSON.stringify([{
							WKCDocumentID: 'alfa',
							WKCNoteBody: 'bravo',
						}]),
						WKCWriteMasterListItemSelected: JSON.stringify({
							WKCDocumentID: 'alfa',
							WKCNoteBody: 'bravo',
						}),
					});
				});
				
				before(function () {
					browser.fill(WKCWriteMasterFilterField, 'bravo');
				});
				
				before(function () {
					browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
				});

				it('sends WKCWriteMasterDispatchCreate', function () {
					browser.assert.text('#TestWKCWriteMasterDispatchCreate', '0');
				});
			
			});
		
		});

	});

	describe('WKCWriteMasterCreateButton', function test_WKCWriteMasterCreateButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteMasterCreateButton, 'OLSKLayoutButtonNoStyle');
			browser.assert.hasClass(WKCWriteMasterCreateButton, 'OLSKLayoutElementTappable');
		});
		
		it('sets accesskey', function () {
			browser.assert.attribute(WKCWriteMasterCreateButton, 'accesskey', 'n');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteMasterDispatchCreate', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteMasterCreateButton);
			});

			it('sends WKCWriteMasterDispatchCreate', function () {
				browser.assert.text('#TestWKCWriteMasterDispatchCreate', '1');
			});
		
		});
	
	});

	describe('WKCWriteMasterBody', function test_WKCWriteMasterBody () {
		
		it('classes OLSKMobileViewBody', function () {
			browser.assert.hasClass(WKCWriteMasterBody, 'OLSKMobileViewBody');
		});
	
	});

	describe('WKCWriteMasterListItem', function test_WKCWriteMasterListItem() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterListItems: JSON.stringify([{
					WKCDocumentID: 'alfa',
					WKCNoteBody: 'bravo',
				}]),
			});
		});

		it('sets text', function () {
			browser.assert.text(WKCWriteMasterListItem, 'bravo');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteMasterDispatchClick', '0');
				browser.assert.text('#TestWKCWriteMasterDispatchClickData', 'undefined');
			});
			
			before(function () {
				return browser.click(WKCWriteMasterListItem);
			});

			it('sends WKCWriteMasterDispatchClick', function () {
				browser.assert.text('#TestWKCWriteMasterDispatchClick', '1');
				browser.assert.text('#TestWKCWriteMasterDispatchClickData', JSON.stringify({
					WKCDocumentID: 'alfa',
					WKCNoteBody: 'bravo',
				}));
			});
		
		});
		
	});

	describe('WKCWriteMasterListItemSelected', function test_WKCWriteMasterListItemSelected() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterListItems: JSON.stringify([{
					WKCDocumentID: 'alfa',
					WKCNoteBody: 'bravo',
				}, {
					WKCDocumentID: 'charlie',
					WKCNoteBody: 'delta',
				}]),
				WKCWriteMasterListItemSelected: JSON.stringify({
					WKCDocumentID: 'charlie',
					WKCNoteBody: 'delta',
				}),
			});
		});

		it('sets OLSKResultsListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
			browser.assert.hasClass(`.OLSKResultsListItem:nth-child(2)`, 'OLSKResultsListItemSelected');
		});
		
	});

});
