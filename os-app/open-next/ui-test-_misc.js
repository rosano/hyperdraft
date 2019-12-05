import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWrite_Misc', function () {

	describe('WKCWriteMaster', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('sets class', function () {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		context('create', function() {

			before(function () {
				return browser.pressButton(WKCWriteMasterCreateButton);
			});

			it('sets class', function() {
				browser.assert.hasClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarBackButton);
			});

			it('sets class', function() {
				browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
			});

		});
	
	});

	describe('WKCWriteDetail', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('sets class', function () {
			browser.assert.hasClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
		});

		context('create', function() {

			before(function () {
				return browser.pressButton(WKCWriteMasterCreateButton);
			});

			it('sets class', function() {
				browser.assert.hasNoClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarBackButton);
			});

			it('sets class', function() {
				browser.assert.hasClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
			});

		});
	
	});

	describe('WKCWriteStorageWidget', function () {
		
		it('sets class', function () {
			browser.assert.hasClass(WKCWriteStorageWidget, 'WKCWriteStorageWidgetHidden');
			browser.assert.hasClass(WKCWriteStorageWidget, 'OLSKMobileViewFooter');
		});

		context('click WKCWriteFooterStorageButton', function () {
			
			before(function () {
				return browser.pressButton('.WKCWriteFooterStorageButton');
			});
			
			it('sets class', function () {
				browser.assert.hasNoClass(WKCWriteStorageWidget, 'WKCWriteStorageWidgetHidden');
			});
		
		});
	
	});

	context('create', function() {

		before(function () {
			return browser.pressButton(WKCWriteMasterCreateButton);
		});

		it('sets document.activeElement', function() {
			deepEqual(browser.document.activeElement, browser.query('.WKCWriteDetailFormNameField'));
		});

	});

});
