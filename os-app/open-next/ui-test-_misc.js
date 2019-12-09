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
		browser.assert.elements('.OLSKResultsListItemSelected', 0);
	});

	it('classes OLSKMobileViewInactive', function () {
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
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCWriteEditor', function() {
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
			browser.assert.elements('.OLSKResultsListItemSelected', 0);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('focuses WKCWriteMasterFilterField', function() {
			browser.assert.hasFocus('.WKCWriteMasterFilterField');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
		});

	});

	context('arrow', function test_arrow () {
		
		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		it('classes WKCWriteMasterFocused', function() {
			browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterFocused');
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});

	});

	context('tab', function test_tab () {
		
		context('master focused', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Tab');
			});

			it.skip('classes WKCWriteMasterFocused', function() {
				browser.assert.hasNoClass('.WKCWriteMaster', 'WKCWriteMasterFocused');
			});

			it.skip('focus WKCWriteEditor', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});
		
		context('editor focused', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Tab');
			});

			it('classes WKCWriteMasterFocused', function() {
				browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterFocused');
			});

			it.skip('focus WKCWriteEditor', function() {
				browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});

	});

	context('click', function test_click () {
		
		before(function () {
			return browser.pressButton('.WIKWriteDetailToolbarBackButton');
		});

		before(function () {
			return browser.click('.WKCWriteMasterFilterField');
		});

		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});
		
		before(function () {
			return browser.click('.WKCWriteMasterListItem');
		});

		it.skip('classes WKCWriteMasterFocused', function() {
			browser.assert.hasNoClass('.WKCWriteMaster', 'WKCWriteMasterFocused');
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.WIKWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WIKWriteDetailItem', function () {
			browser.assert.elements('.WIKWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCWriteEditor', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('filter', function test_filter () {

		before(function () {
			browser.fill('.WKCWriteEditorFieldDebug', 'alfa');
		});

		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		before(function () {
			browser.fill('.WKCWriteEditorFieldDebug', 'bravo');
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
				browser.assert.elements('.OLSKResultsListItemSelected', 1);
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
				browser.assert.elements('.OLSKResultsListItemSelected', 1);
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
				browser.assert.elements('.OLSKResultsListItemSelected', 0);
			});

			it('sets WIKWriteDetailItem', function () {
				browser.assert.elements('.WIKWriteDetailPlaceholder', 1);
			});
		
		});

	});

	context('selection', function test_selection () {
		
		before(function () {
			return browser.click('.WKCWriteMasterListItem');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.hasClass('.OLSKResultsListItem:first-of-type', 'OLSKResultsListItemSelected');
		});

		context('arrow', function () {

			before(function () {
				return browser.query('.WKCWriteEditorFieldDebug').focus();
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
			});

			it('sets no WKCWriteMasterListItemSelected', function () {
				browser.assert.hasClass('.OLSKResultsListItem:first-of-type', 'OLSKResultsListItemSelected');
			});
		
		});

	});

	context('jump', function test_jump () {

		before(function () {
			return browser.fill('.WKCWriteEditorFieldDebug', '# alfa');
		});

		before(function () {
			return browser.pressButton('.WIKWriteDetailToolbarJumpButton');
		});

		it('runs Launchlet', function() {
			browser.assert.elements('.LCHLauncherFilterPrompt', 1);
		});

		it('sets LCHLauncherRecipes', function() {
			browser.assert.elements('.LCHLauncherPipeItemTitle', '# alfa');
		});

		context('execute', function () {

			it.skip('focus WKCWriteEditor', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});

	});

	context('publish', function test_publish () {
		
		before(function () {
			return browser.click('.WIKWriteDetailToolbarPublishButton');
		});

		it('sets WKCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.WIKWriteDetailToolbarPublishButton', 0);
		});

	});

	context('retract', function test_retract () {
		
		before(function () {
			return browser.click('.WIKWriteDetailToolbarRetractButton');
		});

		it('sets WKCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.WIKWriteDetailToolbarPublishButton', 1);
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
