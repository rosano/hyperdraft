import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteMaster_Misc', function () {

	describe('WKCWriteMaster', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('sets class', function () {
			browser.assert.hasClass(WKCWriteMaster, 'OLSKViewportMaster');
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

			it('sets class', function () {
				browser.assert.hasClass(WKCWriteMaster, 'OLSKMobileViewInactive');
			});
		
		});
	
	});

	describe('WKCWriteMasterToolbar', function () {
		
		it('sets class', function () {
			browser.assert.hasClass(WKCWriteMasterToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('WKCWriteMasterCreateButton', function () {
		
		it('sets class', function () {
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

	describe('WKCWriteMasterBody', function () {
		
		it('sets class', function () {
			browser.assert.hasClass(WKCWriteMasterBody, 'OLSKMobileViewBody');
		});
	
	});

	describe('WKCWriteMasterListItem', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterListItems: JSON.stringify([{
					WKCDocumentID: 'alfa',
					WKCDocumentName: 'bravo',
				}]),
			});
		});

		it('sets text', function () {
			browser.assert.text(WKCWriteMasterListItem, 'bravo');
		});


		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteMasterDispatchSelect', '0');
				browser.assert.text('#TestWKCWriteMasterDispatchSelectData', 'undefined');
			});
			
			before(function () {
				return browser.click(WKCWriteMasterListItem);
			});

			it('sends WKCWriteMasterDispatchSelect', function () {
				browser.assert.text('#TestWKCWriteMasterDispatchSelect', '1');
				browser.assert.text('#TestWKCWriteMasterDispatchSelectData', JSON.stringify({
					WKCDocumentID: 'alfa',
					WKCDocumentName: 'bravo',
				}));
			});
		
		});
		
	});

	describe('WKCWriteMasterListItemSelected', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteMasterListItems: JSON.stringify([{
					WKCDocumentID: 'alfa',
					WKCDocumentName: 'bravo',
				}, {
					WKCDocumentID: 'charlie',
					WKCDocumentName: 'delta',
				}]),
				WKCWriteMasterListItemSelected: JSON.stringify({
					WKCDocumentID: 'charlie',
					WKCDocumentName: 'delta',
				}),
			});
		});

		it('sets class', function () {
			browser.assert.elements('.WKCWriteMasterListItemSelected', 1);
			browser.assert.hasClass(`${ WKCWriteMasterListItem }:nth-child(2)`, 'WKCWriteMasterListItemSelected');
		});
		
	});

});
