const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCNote = require('../_shared/KVCNote/main.js').default;

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

	describe('KVCWriteCreateButton', function test_KVCWriteCreateButton () {
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteCreateButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteCreateButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteCreateButton, 'OLSKToolbarButton');
		});
		
		it('sets accesskey', function () {
			browser.assert.attribute(KVCWriteCreateButton, 'accesskey', 'n');
		});
	
	});

	describe('KVCWriteCreateButtonImage', function test_KVCWriteCreateButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteCreateButtonImage } #_OLSKSharedCreate`, 1);
		});
	
	});
	
	context('create', function test_create () {

		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});

		before(function () {
			return browser.pressButton('.KVCWriteCreateButton');
		});

		it.skip('focus KVCWriteInput', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});

	});

	context('select', function test_select () {
		
		before(function () {
			// browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});
		
		before(function () {
			return browser.click('.KVCWriteListItem');
		});

		it('sets KVCWriteListItemSelected', function () {
			browser.assert.elements('.OLSKCollectionItemLocus', 1);
		});

		it('sets KVCWriteDetailItem', function () {
			browser.assert.elements('.KVCWriteDetail', 1);
		});

		it.skip('focus KVCWriteInput', function() {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
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
			return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchConnected');
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

		context('edit', function () {

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa');
			});

			it('calls ControlNotePublish', function () {
				browser.assert.text('#TestControlNotePublishCount', '2');
			});
		
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

	describe('KVCWriteCloudToolbar', function test_KVCWriteCloudToolbar () {

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KVCWriteCloudToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KVCWriteCloudToolbar, 'OLSKToolbarJustify');
		});
		
		it('classes OLSKCommonEdgeTop', function () {
			browser.assert.hasClass(KVCWriteCloudToolbar, 'OLSKCommonEdgeTop');
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

		it.skip('calls ControlNotePublish', function () {
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
			browser.assert.input('.OLSKMasterListFilterField', require('./ui-logic.js').default.KVCWritePublicSymbol());
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
