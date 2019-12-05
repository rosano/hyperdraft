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
				return browser.pressButton(WIKWriteDetailToolbarBackButton);
			});

			it('sets class', function() {
				browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
			});

		});
	
	});

	describe('WIKWriteDetail', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('sets class', function () {
			browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		context('create', function() {

			before(function () {
				return browser.pressButton(WKCWriteMasterCreateButton);
			});

			it('sets class', function() {
				browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarBackButton);
			});

			it('sets class', function() {
				browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
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
			deepEqual(browser.document.activeElement, browser.query('.WIKWriteDetailFormNameField'));
		});

	});

});
