const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCNoteStorage = require('../_shared/KVCNote/storage.js').default;

describe('KVCWrite_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('sets meta:viewport', function () {
		browser.assert.attribute('meta[name=viewport]', 'content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
	});
	
	it('sets meta:mobile-web-app-capable', function () {
		browser.assert.attribute('meta[name=mobile-web-app-capable]', 'content', 'yes');
	});
	
	it('sets meta:apple-mobile-web-app-capable', function () {
		browser.assert.attribute('meta[name=apple-mobile-web-app-capable]', 'content', 'yes');
	});

	context('KVCWrite', function () {
		
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

		it('focuses OLSKMasterListFilterField', function() {
			browser.assert.hasFocus('.OLSKMasterListFilterField');
		});
	
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

		// it('focuses OLSKMasterListFilterField', function() {
		// 	browser.assert.hasFocus('.OLSKMasterListFilterField');
		// });

		// it('sets KVCWriteDetailItem', function () {
		// 	browser.assert.elements('.OLSKDetailPlaceholder', 1);
		// });

	});

	context('arrow', function test_arrow () {
		
		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'ArrowDown');
		});

		// it('classes OLSKMasterListFocused', function() {
		// 	browser.assert.hasClass('.KVCWriteMaster', 'OLSKMasterListFocused');
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

			it.skip('classes OLSKMasterListFocused', function() {
				browser.assert.hasNoClass('.KVCWriteMaster', 'OLSKMasterListFocused');
			});

			it.skip('focus KVCWriteInput', function() {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
		
		});
		
		context('editor focused', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Tab');
			});

			it('classes OLSKMasterListFocused', function() {
				browser.assert.hasClass('.KVCWriteMaster', 'OLSKMasterListFocused');
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
			browser.fill('.OLSKMasterListFilterField', 'alfa');
		});

		before(function () {
			browser.assert.input('.OLSKMasterListFilterField', 'alfa');
		});

		before(function () {
			browser.query('.KVCWriteInputFieldDebug').focus();
		});

		before(function () {
			browser.assert.hasFocus('.KVCWriteInputFieldDebug');
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});
		
		it('focuses OLSKMasterListFilterField', function() {
			browser.assert.hasFocus('.OLSKMasterListFilterField');
		});
		
		it.skip('clears KVCWriteMasterFilterText', function() {
			browser.assert.input('.OLSKMasterListFilterField', '');
		});

	});

	context('select', function test_select () {
		
		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});
		
		before(function () {
			return browser.click('.KVCWriteMasterListItem');
		});

		it.skip('classes OLSKMasterListFocused', function() {
			browser.assert.hasNoClass('.KVCWriteMaster', 'OLSKMasterListFocused');
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
				browser.fill('.OLSKMasterListFilterField', 'charlie');
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
				browser.fill('.OLSKMasterListFilterField', 'a');
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
				browser.fill('.OLSKMasterListFilterField', 'bravo');
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
			return browser.pressButton('.KVCWriteDetailToolbarConnectButton');
		});

		before(function () {
			return browser.OLSKLauncherRun('FakeStorageIsConnected');
		});

		before(function () {
			browser.assert.text('#TestControlNotePublishCount', '0');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarPublishButton');
		});

		it('calls ControlNotePublish', function () {
			browser.assert.text('#TestControlNotePublishCount', '1');
		});

		it('sets KVCWriteDetailPublicURLFor', function () {
			browser.assert.attribute('.KVCWriteDetailToolbarPublicLink', 'href', '/FakePublicPath');
		});

	});

	context('retract', function test_retract () {

		before(function () {
			browser.assert.text('#TestControlNoteRetractCount', '0');
		});

		before(function () {
			return browser.pressButton('.KVCWriteDetailToolbarRetractButton');
		});

		it('calls ControlNoteRetract', function () {
			browser.assert.text('#TestControlNoteRetractCount', '1');
		});

		it('sets KVCNoteIsPublic', function () {
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

			it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
				browser.assert.attribute('.OLSKMasterListItem', 'aria-label', 'alfa');
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

			it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
				browser.assert.attribute('.OLSKMasterListItem', 'aria-label', 'alfa');
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

			it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
				browser.assert.attribute('.OLSKMasterListItem', 'aria-label', 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
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

			it('sets OLSKMasterListItemAccessibilitySummaryFor', function () {
				browser.assert.attribute('.OLSKMasterListItem', 'aria-label', '');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', '');
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');
			});
		
		});

		context('KVCNoteModelIsPublic', function () {
			
			before(function () {
				return browser.pressButton('.KVCWriteDetailToolbarConnectButton');
			});

			before(function () {
				return browser.OLSKLauncherRun('FakeStorageIsConnected');
			});

			before(function () {
				return browser.pressButton('.KVCWriteDetailToolbarPublishButton');
			});

			before(function () {
				browser.assert.text('#TestControlNotePublishCount', '1');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa');
			});

			it('calls ControlNotePublish', function () {
				browser.assert.text('#TestControlNotePublishCount', '2');
			});
		
		});

	});

	describe('KVCWriteViewportFooter', function test_KVCWriteViewportFooter () {

		it('classes OLSKMobileViewFooter', function () {
			browser.assert.hasClass(KVCWriteViewportFooter, 'OLSKMobileViewFooter');
		});

	});

	describe('OLSKApropos', function test_OLSKApropos() {

		before(function () {
			return browser.pressButton('.OLSKAppToolbarAproposButton');
		});

		it('sets OLSKAproposFeedbackValue', function () {
			browser.assert.attribute('.OLSKAproposFeedbackButton', 'href', `javascript:window.location.href = window.atob('${ browser.window.btoa('mailto:' + OLSKTestingFormatted(process.env.OLSK_APROPOS_FEEDBACK_EMAIL, 'RP_003')) }')`);
		});

		after(function () {
			browser.pressButton('.OLSKModalViewCloseButton');
		});

	});

	describe('OLSKAppToolbarGuideLink', function test_OLSKAppToolbarGuideLink() {

		it('binds OLSKAppToolbarGuideURL', function () {
			browser.assert.attribute('.OLSKAppToolbarGuideLink', 'href', OLSKTestingCanonical(require('../open-guide/controller.js').OLSKControllerRoutes().shift()));
		});

	});

	describe('KVCWriteStorageToolbar', function test_KVCWriteStorageToolbar () {

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KVCWriteStorageToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KVCWriteStorageToolbar, 'OLSKToolbarJustify');
		});
		
		it('classes OLSKStorageToolbar', function () {
			browser.assert.hasClass(KVCWriteStorageToolbar, 'OLSKStorageToolbar');
		});
		
		it('classes OLSKCommonEdgeTop', function () {
			browser.assert.hasClass(KVCWriteStorageToolbar, 'OLSKCommonEdgeTop');
		});
	
	});

	describe('KVCWriteStorageExportButton', function test_KVCWriteStorageExportButton () {
		
		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteStorageExportButton, 'OLSKDecorTappable');
		});
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteStorageExportButton, 'OLSKDecorButtonNoStyle');
		});

	});

	describe.skip('KVCWriteLauncherItemConfigureCustomDomain', function test_KVCWriteLauncherItemConfigureCustomDomain () {
		
		before(function () {
			return browser.pressButton('.OLSKAppToolbarLauncherButton');
		});

		before(function () {
			return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemConfigureCustomDomain');
		});

		const prompt1 = {};

		before(function () {
			return browser.OLSKPrompt(function () {
				return browser.click('.LCHLauncherPipeItem');
			}, function (dialog) {
				return Object.assign(prompt1, dialog);
			});
		});

		before(function () {
			return browser.OLSKPrompt(function () {
				return browser.click('.LCHLauncherPipeItem');
			}, function (dialog) {
				dialog.response = 'FakeCustomDomainBaseURL';
				
				return dialog;
			});
		});

		it('sets KVCWriteLauncherItemConfigureCustomDomainPrompt1Response', function () {
			browser.assert.deepEqual(prompt1.response, KVCNoteStorage.KVCNoteStoragePublicRootPagePath());
		});

		it('sets KVCWriteDetailPublicURLFor', function () {
			browser.assert.attribute('.KVCWriteDetailToolbarPublicLink', 'href', 'FakeCustomDomainBaseURL/FakePublicPath');
		});
	
	});

	describe.skip('KVCWriteLauncherItemRemoveCustomDomain', function test_KVCWriteLauncherItemRemoveCustomDomain () {
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteLauncherItemRemoveCustomDomain');
		});

		it('sets KVCWriteDetailPublicURLFor', function () {
			browser.assert.attribute('.KVCWriteDetailToolbarPublicLink', 'href', '/FakePublicPath');
		});
	
	});

	describe('KVCWriteDetailLauncherItemSetAsRootPage', function test_KVCWriteDetailLauncherItemSetAsRootPage () {
		
		before(function () {
			browser.assert.text('#TestControlNotePublishCount', '2');
		});

		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemSetAsRootPage');
		});

		it('sets KVCWriteDetailItemIsRootPage', function () {
			browser.assert.elements('.KVCWriteDetailToolbarIsRootPage', 1);
		});

		it.skip('sets KVCWriteDetailPublicURLFor', function () {
			browser.assert.attribute('.KVCWriteDetailToolbarPublicLink', 'href', 'FakeCustomDomainBaseURL/');
		});

		it('calls ControlNotePublish', function () {
			browser.assert.text('#TestControlNotePublishCount', '3');
		});
	
	});

	describe('KVCWriteLauncherItemShowPublicNotes', function test_KVCWriteLauncherItemShowPublicNotes () {
		
		before(function () {
			browser.assert.input('.OLSKMasterListFilterField', '');
		});

		before(function () {
			return browser.OLSKLauncherRun('KVCWriteLauncherItemShowPublicNotes');
		});

		it('sets OLSKMasterListFilterField text', function () {
			browser.assert.input('.OLSKMasterListFilterField', require('./ui-logic.js').default.KVCWriteLogicPublicSymbol());
		});

		it('focuses OLSKMasterListFilterField', function() {
			browser.assert.hasFocus('.OLSKMasterListFilterField');
		});

	});

	describe('KVCWriteLegacyRoute', function () {
		
		before(function () {
			return browser.OLSKVisit(require('./controller.js').OLSKControllerRoutes().pop());
		});

		it('redirects', function() {
			browser.assert.url('http://' + browser.site + require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath);
		});
	
	});

});
