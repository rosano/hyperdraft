import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWrite_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('classes WKCWriteMaster', function () {
		browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
	});

	it('sets WKCWriteMasterListItemSelected', function () {
		browser.assert.elements('.WKCWriteMasterListItemSelected', 0);
	});

	it('classes WIKWriteDetail', function () {
		browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
	});

	it('sets WIKWriteDetailItem', function () {
		browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
	});
	
	context('create', function test_create () {

		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});

		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		it('classes WKCWriteMaster', function() {
			browser.assert.hasClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.WKCWriteMasterListItemSelected', 1);
		});

		it('classes WIKWriteDetail', function() {
			browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCEditor', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('back', function test_back () {

		before(function () {
			return browser.pressButton('.WIKWriteDetailToolbarBackButton');
		});

		it('classes WKCWriteMaster', function() {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.WKCWriteMasterListItemSelected', 0);
		});

		it('classes WIKWriteDetail', function() {
			browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('focuses WKCWriteMasterFilterField', function() {
			browser.assert.hasFocus('.WKCWriteMasterFilterField');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
		});

	});

	context('select', function test_select () {
		
		before(function () {
			return browser.click('.WKCWriteMasterFilterField');
		});

		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});
		
		before(function () {
			return browser.click('.WKCWriteMasterListItem');
		});

		it('classes WKCWriteMaster', function() {
			browser.assert.hasClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.WKCWriteMasterListItemSelected', 1);
		});

		it('classes WIKWriteDetail', function() {
			browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCEditor', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('filter', function test_filter () {

		before(function () {
			browser.fill('.WKCEditorFieldDebug', 'alfa');
		});

		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		before(function () {
			browser.fill('.WKCEditorFieldDebug', 'bravo');
		});

		context('no match', function () {
			
			before(function () {
				browser.fill('.WKCWriteMasterFilterField', 'charlie');
			});

			it('filters all WKCWriteMasterListItem', function() {
				browser.assert.elements('.WKCWriteMasterListItem', 0);
			});

			it('sets WIKWriteDetailItem', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
			});
		
		});

		context('partial match', function () {

			before(function () {
				browser.fill('.WKCWriteMasterFilterField', 'a');
			});

			it('filters partial WKCWriteMasterListItem', function() {
				browser.assert.elements('.WKCWriteMasterListItem', 2);
			});

			it('sets WKCWriteMasterListItemSelected', function () {
				browser.assert.elements('.WKCWriteMasterListItemSelected', 1);
			});

			it('sets WIKWriteDetailItem', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
			});
		
		});

		context('exact match', function () {

			before(function () {
				browser.fill('.WKCWriteMasterFilterField', 'bravo');
			});

			it('filters exact WKCWriteMasterListItem', function() {
				browser.assert.elements('.WKCWriteMasterListItem', 1);
			});

			it('sets WKCWriteMasterListItemSelected', function () {
				browser.assert.elements('.WKCWriteMasterListItemSelected', 1);
			});

			it('sets WIKWriteDetailItem', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
			});
		
		});

		context('clear', function () {
			
			before(function () {
				return browser.pressButton('.OLSKInputWrapperClearButton');
			});

			it('filters no WKCWriteMasterListItem', function() {
				browser.assert.elements('.WKCWriteMasterListItem', 2);
			});

			it('sets WKCWriteMasterListItemSelected', function () {
				browser.assert.elements('.WKCWriteMasterListItemSelected', 0);
			});

			it('sets WIKWriteDetailItem', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
			});
		
		});

	});

	describe('WKCWriteStorageWidget', function test_WKCWriteStorageWidget () {
		
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
