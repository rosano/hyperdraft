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
		browser.assert.hasClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
	});

	it('sets WKCWriteDetailItem', function () {
		browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
	});

	it('focuses WKCWriteMasterFilterField', function() {
		browser.assert.hasFocus('.WKCWriteMasterFilterField');
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
			browser.assert.hasNoClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteDetailItem', function () {
			browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCWriteEditor', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('back', function test_back () {

		before(function () {
			return browser.pressButton('.WKCWriteDetailToolbarBackButton');
		});

		it('classes WKCWriteMaster', function() {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		// it('sets WKCWriteMasterListItemSelected', function () {
		// 	browser.assert.elements('.OLSKResultsListItemSelected', 0);
		// });

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
		});

		// it('focuses WKCWriteMasterFilterField', function() {
		// 	browser.assert.hasFocus('.WKCWriteMasterFilterField');
		// });

		// it('sets WKCWriteDetailItem', function () {
		// 	browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
		// });

	});

	context('arrow', function test_arrow () {
		
		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		// it('classes WKCWriteMasterFocused', function() {
		// 	browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterFocused');
		// });

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.WKCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteDetailItem', function () {
			browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
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

	context('escape', function test_escape () {

		before(function () {
			browser.fill('.WKCWriteEditorFieldDebug', 'alfa');
		});

		before(function () {
			browser.fill('.WKCWriteMasterFilterField', 'alfa');
		});

		before(function () {
			browser.assert.input('.WKCWriteMasterFilterField', 'alfa')
		});

		before(function () {
			browser.query('.WKCWriteEditorFieldDebug').focus();
		});

		before(function () {
			deepEqual(browser.activeElement, browser.query('.WKCWriteEditorFieldDebug'))
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});
		
		it('focuses WKCWriteMasterFilterField', function() {
			deepEqual(browser.activeElement, browser.query('.WKCWriteMasterFilterField'));
		});
		
		it('clears WKCWriteMasterFilterText', function() {
			browser.assert.input('.WKCWriteMasterFilterField', '')
		});

	});

	context('select', function test_select () {
		
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
			browser.assert.hasNoClass('.WKCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets WKCWriteDetailItem', function () {
			browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
		});

		it.skip('focus WKCWriteEditor', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('filter', function test_filter () {

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

			it('sets WKCWriteDetailItem', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
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

			it('sets WKCWriteDetailItem', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
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

			it('sets WKCWriteDetailItem', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 0);
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

			it('sets WKCWriteDetailItem', function () {
				browser.assert.elements('.WKCWriteDetailPlaceholder', 1);
			});

			it('sorts WKCWriteMasterListItem', function () {
				browser.assert.text('.WKCWriteMasterListItemTitle', 'bravoalfa')
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
			return browser.pressButton('.WKCWriteDetailToolbarJumpButton');
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
			return browser.click('.WKCWriteDetailToolbarPublishButton');
		});

		it('sets WKCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.WKCWriteDetailToolbarPublishButton', 0);
		});

	});

	context('retract', function test_retract () {
		
		before(function () {
			return browser.click('.WKCWriteDetailToolbarRetractButton');
		});

		it('sets WKCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.WKCWriteDetailToolbarPublishButton', 1);
		});

	});

	context('edit', function test_edit () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		before(function () {
			return browser.pressButton('.WKCWriteMasterCreateButton');
		});

		context('title', function () {
			
			before(function () {
				browser.fill('.WKCWriteEditorFieldDebug', 'alfa');
			});

			it('sets WKCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.WKCWriteMasterListItemAccessibilitySummary', 'alfa');
			});

			it('sets WKCWriteMasterListItemTitle', function () {
				browser.assert.text('.WKCWriteMasterListItemTitle', 'alfa');
			});

			it('sets WKCWriteMasterListItemSnippet', function () {
				browser.assert.text('.WKCWriteMasterListItemSnippet', '');
			});
		
		});

		context('body', function () {
			
			before(function () {
				browser.fill('.WKCWriteEditorFieldDebug', 'alfa\nbravo');
			});

			it('sets WKCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.WKCWriteMasterListItemAccessibilitySummary', 'alfa');
			});

			it('sets WKCWriteMasterListItemTitle', function () {
				browser.assert.text('.WKCWriteMasterListItemTitle', 'alfa');
			});

			it('sets WKCWriteMasterListItemSnippet', function () {
				browser.assert.text('.WKCWriteMasterListItemSnippet', 'bravo');
			});
		
		});

		context('long title', function () {
			
			before(function () {
				browser.fill('.WKCWriteEditorFieldDebug', 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilos');
			});

			it('sets WKCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.WKCWriteMasterListItemAccessibilitySummary', 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
			});

			it('sets WKCWriteMasterListItemTitle', function () {
				browser.assert.text('.WKCWriteMasterListItemTitle', 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
			});

			it('sets WKCWriteMasterListItemSnippet', function () {
				browser.assert.text('.WKCWriteMasterListItemSnippet', '');
			});
		
		});

		context('long body', function () {
			
			before(function () {
				browser.fill('.WKCWriteEditorFieldDebug', '\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
			});

			it('sets WKCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.WKCWriteMasterListItemAccessibilitySummary', '');
			});

			it('sets WKCWriteMasterListItemTitle', function () {
				browser.assert.text('.WKCWriteMasterListItemTitle', '');
			});

			it('sets WKCWriteMasterListItemSnippet', function () {
				browser.assert.text('.WKCWriteMasterListItemSnippet', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');
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
