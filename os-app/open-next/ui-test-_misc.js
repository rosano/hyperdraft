import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWrite_Misc', function () {

	describe('WKCWrite', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		context('create', function() {

			before(function () {
				// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});

			before(function () {
				return browser.pressButton('.WKCWriteMasterCreateButton');
			});

			it.skip('focus WKCEditor', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton('.WIKWriteDetailToolbarBackButton');
			});

			it('focuses WKCWriteMasterFilterField', function() {
				browser.assert.hasFocus('.WKCWriteMasterFilterField');
			});

		});

		context('select', function() {
			
			before(function () {
				return browser.click('.WKCWriteMasterFilterField');
			});

			before(function () {
				// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});
			
			before(function () {
				return browser.click('.WKCWriteMasterListItem');
			});

			it.skip('focus WKCEditor', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});

		});
	
	});

	describe('WKCWriteMaster', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('classes OLSKMobileViewInactive', function () {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		context('create', function() {

			before(function () {
				// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});

			before(function () {
				return browser.pressButton('.WKCWriteMasterCreateButton');
			});

			it('classes OLSKMobileViewInactive', function() {
				browser.assert.hasClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
			});

			it.skip('focus WKCEditor', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton('.WIKWriteDetailToolbarBackButton');
			});

			it('classes OLSKMobileViewInactive', function() {
				browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
			});

		});
	
	});

	describe('WIKWriteDetail', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		it('classes OLSKMobileViewInactive', function () {
			browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		context('create', function() {

			before(function () {
				return browser.pressButton('.WKCWriteMasterCreateButton');
			});

			it('classes OLSKMobileViewInactive', function() {
				browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
			});

		});

		context('back', function() {

			before(function () {
				return browser.pressButton('.WIKWriteDetailToolbarBackButton');
			});

			it('classes OLSKMobileViewInactive', function() {
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

});
