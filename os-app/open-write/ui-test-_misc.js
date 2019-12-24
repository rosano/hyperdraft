import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('classes KVCWriteMaster', function () {
		browser.assert.hasNoClass('.KVCWriteMaster', 'OLSKMobileViewInactive');
	});

	it('sets KVCWriteMasterListItemSelected', function () {
		browser.assert.elements('.OLSKResultsListItemSelected', 0);
	});

	it('classes OLSKMobileViewInactive', function () {
		browser.assert.hasClass('.KVCWriteDetail', 'OLSKMobileViewInactive');
	});

	it('sets KVCWriteDetailItem', function () {
		browser.assert.elements('.OLSKDetailPlaceholder', 1);
	});

	it('focuses KVCWriteMasterFilterField', function() {
		browser.assert.hasFocus('.KVCWriteMasterFilterField');
	});
	
	context('create', function test_create () {

		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		it('classes KVCWriteMaster', function() {
			browser.assert.hasClass('.KVCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.KVCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteDetailItem', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});

		it.skip('focus KVCWriteInput', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('back', function test_back () {

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarBackButton');
		});

		it('classes KVCWriteMaster', function() {
			browser.assert.hasNoClass('.KVCWriteMaster', 'OLSKMobileViewInactive');
		});

		// it('sets KVCWriteMasterListItemSelected', function () {
		// 	browser.assert.elements('.OLSKResultsListItemSelected', 0);
		// });

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.KVCWriteDetail', 'OLSKMobileViewInactive');
		});

		// it('focuses KVCWriteMasterFilterField', function() {
		// 	browser.assert.hasFocus('.KVCWriteMasterFilterField');
		// });

		// it('sets KVCWriteDetailItem', function () {
		// 	browser.assert.elements('.OLSKDetailPlaceholder', 1);
		// });

	});

	context('arrow', function test_arrow () {
		
		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		// it('classes KVCWriteMasterFocused', function() {
		// 	browser.assert.hasClass('.KVCWriteMaster', 'KVCWriteMasterFocused');
		// });

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.KVCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.KVCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteDetailItem', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});

	});

	context('tab', function test_tab () {
		
		context('master focused', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Tab');
			});

			it.skip('classes KVCWriteMasterFocused', function() {
				browser.assert.hasNoClass('.KVCWriteMaster', 'KVCWriteMasterFocused');
			});

			it.skip('focus KVCWriteInput', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});
		
		context('editor focused', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Tab');
			});

			it('classes KVCWriteMasterFocused', function() {
				browser.assert.hasClass('.KVCWriteMaster', 'KVCWriteMasterFocused');
			});

			it.skip('focus KVCWriteInput', function() {
				browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});

	});

	context('escape', function test_escape () {

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'alfa');
		});

		before(function () {
			browser.fill('.KVCWriteMasterFilterField', 'alfa');
		});

		before(function () {
			browser.assert.input('.KVCWriteMasterFilterField', 'alfa');
		});

		before(function () {
			browser.query('.KVCWriteInputFieldDebug').focus();
		});

		before(function () {
			deepEqual(browser.activeElement, browser.query('.KVCWriteInputFieldDebug'));
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});
		
		it('focuses KVCWriteMasterFilterField', function() {
			deepEqual(browser.activeElement, browser.query('.KVCWriteMasterFilterField'));
		});
		
		it('clears KVCWriteMasterFilterText', function() {
			browser.assert.input('.KVCWriteMasterFilterField', '');
		});

	});

	context('select', function test_select () {
		
		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});
		
		before(function () {
			return browser.click('.KVCWriteMasterListItem');
		});

		it.skip('classes KVCWriteMasterFocused', function() {
			browser.assert.hasNoClass('.KVCWriteMaster', 'KVCWriteMasterFocused');
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasClass('.KVCWriteMaster', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteMasterListItemSelected', function () {
			browser.assert.elements('.OLSKResultsListItemSelected', 1);
		});

		it('classes OLSKMobileViewInactive', function() {
			browser.assert.hasNoClass('.KVCWriteDetail', 'OLSKMobileViewInactive');
		});

		it('sets KVCWriteDetailItem', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});

		it.skip('focus KVCWriteInput', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('filter', function test_filter () {

		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		before(function () {
			browser.fill('.KVCWriteInputFieldDebug', 'bravo');
		});

		context('no match', function () {
			
			before(function () {
				browser.fill('.KVCWriteMasterFilterField', 'charlie');
			});

			it('filters all KVCWriteMasterListItem', function() {
				browser.assert.elements('.KVCWriteMasterListItem', 0);
			});

			it('sets KVCWriteDetailItem', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});
		
		});

		context('partial match', function () {

			before(function () {
				browser.fill('.KVCWriteMasterFilterField', 'a');
			});

			it('filters partial KVCWriteMasterListItem', function() {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('sets KVCWriteMasterListItemSelected', function () {
				browser.assert.elements('.OLSKResultsListItemSelected', 1);
			});

			it('sets KVCWriteDetailItem', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 0);
			});
		
		});

		context('exact match', function () {

			before(function () {
				browser.fill('.KVCWriteMasterFilterField', 'bravo');
			});

			it('filters exact KVCWriteMasterListItem', function() {
				browser.assert.elements('.KVCWriteMasterListItem', 1);
			});

			it('sets KVCWriteMasterListItemSelected', function () {
				browser.assert.elements('.OLSKResultsListItemSelected', 1);
			});

			it('sets KVCWriteDetailItem', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 0);
			});
		
		});

		context('clear', function () {
			
			before(function () {
				return browser.pressButton('.OLSKInputWrapperClearButton');
			});

			it('filters no KVCWriteMasterListItem', function() {
				browser.assert.elements('.KVCWriteMasterListItem', 2);
			});

			it('sets KVCWriteMasterListItemSelected', function () {
				browser.assert.elements('.OLSKResultsListItemSelected', 0);
			});

			it('sets KVCWriteDetailItem', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});

			it('sorts KVCWriteMasterListItem', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', 'bravoalfa');
			});
		
		});

	});

	context('selection', function test_selection () {
		
		before(function () {
			return browser.click('.KVCWriteMasterListItem');
		});

		it('sets KVCWriteMasterListItemSelected', function () {
			browser.assert.hasClass('.OLSKResultsListItem:first-of-type', 'OLSKResultsListItemSelected');
		});

		context('arrow', function () {

			before(function () {
				return browser.query('.KVCWriteInputFieldDebug').focus();
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
			});

			it('sets no KVCWriteMasterListItemSelected', function () {
				browser.assert.hasClass('.OLSKResultsListItem:first-of-type', 'OLSKResultsListItemSelected');
			});
		
		});

	});

	context('jump', function test_jump () {

		before(function () {
			return browser.fill('.KVCWriteInputFieldDebug', '# alfa');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarJumpButton');
		});

		it('runs Launchlet', function() {
			browser.assert.elements('.LCHLauncherFilterPrompt', 1);
		});

		it('sets LCHLauncherRecipes', function() {
			browser.assert.elements('.LCHLauncherPipeItemTitle', '# alfa');
		});

		context('execute', function () {

			it.skip('focus KVCWriteInput', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});

	});

	context('publish', function test_publish () {
		
		before(function () {
			return browser.click('.KVCWriteDetailToolbarPublishButton');
		});

		it('sets KVCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.KVCWriteDetailToolbarPublishButton', 0);
		});

	});

	context('retract', function test_retract () {
		
		before(function () {
			return browser.click('.KVCWriteDetailToolbarRetractButton');
		});

		it('sets KVCNotePublishStatusIsPublished', function () {
			browser.assert.elements('.KVCWriteDetailToolbarPublishButton', 1);
		});

	});

	context('edit', function test_edit () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
		
		before(function () {
			return browser.pressButton('.KVCWriteMasterCreateButton');
		});

		context('title', function () {
			
			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa');
			});

			it('sets KVCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.KVCWriteMasterListItemAccessibilitySummary', 'alfa');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', 'alfa');
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', '');
			});
		
		});

		context('body', function () {
			
			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa\nbravo');
			});

			it('sets KVCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.KVCWriteMasterListItemAccessibilitySummary', 'alfa');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', 'alfa');
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', 'bravo');
			});
		
		});

		context('long title', function () {
			
			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilos');
			});

			it('sets KVCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.KVCWriteMasterListItemAccessibilitySummary', 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', '');
			});
		
		});

		context('long body', function () {
			
			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', '\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
			});

			it('sets KVCWriteMasterListItemAccessibilitySummary', function () {
				browser.assert.text('.KVCWriteMasterListItemAccessibilitySummary', '');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', '');
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');
			});
		
		});

	});

	describe('KVCWriteStorageWidget', function test_KVCWriteStorageWidget () {
		
		it('classes KVCWriteStorageWidgetHidden', function () {
			browser.assert.hasClass(KVCWriteStorageWidget, 'KVCWriteStorageWidgetHidden');
		});

		context('click OLSKAppToolbarStorageButton', function () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarStorageButton');
			});
			
			it('classes KVCWriteStorageWidgetHidden', function () {
				browser.assert.hasNoClass(KVCWriteStorageWidget, 'KVCWriteStorageWidgetHidden');
			});
		
		});
	
	});

	describe('KVCWriteViewportFooter', function test_KVCWriteViewportFooter () {

		it('sets class', function () {
			browser.assert.hasClass(KVCWriteViewportFooter, 'OLSKMobileViewFooter');
		});

	});

	describe('OLSKAppToolbar', function test_OLSKAppToolbar () {

		it('sets OLSKAppToolbarDonateURL', function () {
			browser.assert.attribute('.OLSKAppToolbarDonateLink', 'href', process.env.KVC_SHARED_DONATE_URL);
		});

	});	

});
