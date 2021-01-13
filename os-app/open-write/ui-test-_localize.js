const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCWriteLogic = require('./ui-logic.js').default;

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCWrite_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCWriteTitle'));
		});

		it('localizes KVCWriteLauncherItemJournal', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemJournal', uLocalized('KVCWriteLauncherItemJournalText'));
		});

		it('localizes KVCWriteLauncherItemBacklinks', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemBacklinks', uLocalized('KVCWriteLauncherItemBacklinksText'));
		});

		it('localizes KVCWriteLauncherItemShowPublicNotes', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemShowPublicNotes', uLocalized('KVCWriteLauncherItemShowPublicNotesText'));
		});

		it('localizes KVCWriteLauncherItemImportJSON', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemImportJSON', uLocalized('KVCWriteLauncherItemImportJSONText'));
		});

		it('localizes KVCWriteLauncherItemExportJSON', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemExportJSON', uLocalized('KVCWriteLauncherItemExportJSONText'));
		});

		it('localizes KVCWriteLauncherItemImportTXT', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemImportTXT', uLocalized('KVCWriteLauncherItemImportTXTText'));
		});

		it('localizes KVCWriteLauncherItemImportNV', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemImportNV', uLocalized('KVCWriteLauncherItemImportNVText'));
		});

		context('OLSKAppToolbarStorageButton', function test_OLSKAppToolbarStorageButton () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarStorageButton');
			});

			it('localizes KVCWriteStorageExportButton', function () {
				browser.assert.text(KVCWriteStorageExportButton, uLocalized('KVCWriteStorageExportButtonText'));
			});
		
		});

		context('KVCWriteLauncherItemJournal', function test_KVCWriteLauncherItemJournal () {

			const item = (function(inputData) {
				return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
			})(new Date('2001-02-03T04:05:06Z'));

			before(function () {
				return browser.OLSKLauncherRun('KVCWriteLauncherItemJournal');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(item));
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', '-');
			});
			
			it('sets KVCNoteBody', function () {
				browser.assert.input('.KVCWriteInputFieldDebug', uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(item) + '\n\n- ');
			});
		
		});

		context('KVCWriteLauncherItemBacklinks', function test_KVCWriteLauncherItemBacklinks () {

			const date = (function(inputData) {
				return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
			})(new Date('2001-02-03T04:05:06Z'));
			const item = uLocalized('KVCWriteLauncherItemBacklinksText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(date) + `\n\n# [[${ uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(date) }]]\n`;

			before(function () {
				return browser.OLSKLauncherRun('KVCWriteLauncherItemBacklinks');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.OLSKResultsListItem:nth-child(1) .KVCWriteMasterListItemTitle', item.split('\n').shift());
			});

			it.skip('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', item.split('\n').slice(2).join('\n'));
			});
			
			it('sets KVCNoteBody', function () {
				browser.assert.input('.KVCWriteInputFieldDebug', item);
			});
		
		});

		context('KVCWriteDetailLauncherItemShowLocalVersions', function test_KVCWriteDetailLauncherItemShowLocalVersions () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage,
				});
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			before(function () {
				return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
			});

			const date = (function(inputData) {
				return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
			})(new Date('2001-02-03T04:05:06Z'));

			it('sets KVCNoteBody', function () {
				browser.assert.input('.KVCWriteInputFieldDebug', KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(date, uLocalized, []));
			});

			const item1 = Math.random().toString();
			const item2 = Math.random().toString();

			context('edit', function () {
				
				before(function () {
					browser.fill('.KVCWriteInputFieldDebug', item1);
				});

				before(function () {
					return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
				});

				it('sets KVCNoteBody', function () {
					browser.assert.input('.KVCWriteInputFieldDebug', KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(date, uLocalized, [item1]));
				});
			
			});

			context('edit_multiple', function () {
				
				before(async function () {
					return browser.OLSKConfirm(function () {
						return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
					});
				});

				before(function () {
					return browser.click('.KVCWriteMasterListItem');
				});

				before(function () {
					browser.fill('.KVCWriteInputFieldDebug', item2);
				});

				before(function () {
					return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
				});

				it('sets KVCNoteBody', function () {
					browser.assert.input('.KVCWriteInputFieldDebug', KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(date, uLocalized, [item2, item1]));
				});
			
			});
		
		});

		context('archive', function test_archive () {
			
			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			before(function () {
				browser.fill('.KVCWriteInputFieldDebug', 'alfa-archived');
			});

			before(function () {
				return browser.pressButton('.KVCWriteDetailToolbarArchiveButton');
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
			});

			it('localizes KVCWriteLauncherItemRevealArchive', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemRevealArchive', uLocalized('KVCWriteMasterRevealArchiveButtonText'));
			});

		});

		context('connected', function test_connected () {
			
			before(function () {
				return browser.OLSKLauncherRun('FakeStorageIsConnected');
			});

			it('localizes KVCWriteLauncherItemConfigureCustomDomain', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemConfigureCustomDomain', uLocalized('KVCWriteLauncherItemConfigureCustomDomainText'));
			});

			context.skip('KVCWriteLauncherItemConfigureCustomDomain', function test_KVCWriteLauncherItemConfigureCustomDomain () {

				const prompt1 = {};
				const prompt2 = {};
				let confirmQuestion;

				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(function () {
					return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemConfigureCustomDomain');
				});

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
						return Object.assign(prompt2, dialog);
					});
				});

				before(function () {
					confirmQuestion = browser.OLSKConfirmSync(function () {
						return browser.click('.LCHLauncherPipeItem');
					}).question;
				});

				it('sets KVCWriteLauncherItemConfigureCustomDomainPrompt1Question', function () {
					browser.assert.deepEqual(prompt1.question, uLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt1QuestionText'));
				});

				it('sets KVCWriteLauncherItemConfigureCustomDomainPrompt2Question', function () {
					browser.assert.deepEqual(prompt2.question, uLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt2QuestionText'));
				});

				it('sets KVCWriteLauncherItemConfigureCustomDomainConfirmQuestion', function () {
					browser.assert.deepEqual(confirmQuestion, uLocalized('KVCWriteLauncherItemConfigureCustomDomainConfirmQuestionText'));
				});
			
			});
		
		});

		describe('OLSKApropos', function test_OLSKApropos() {

			before(function () {
				return browser.pressButton('.OLSKAppToolbarAproposButton');
			});

			it('sets OLSKModalViewTitleText', function () {
				browser.assert.text('.OLSKModalViewTitle', uLocalized('OLSKAproposHeadingText'));
			});

			after(function () {
				browser.pressButton('.OLSKModalViewCloseButton');
			});

		});

		describe('tongue', function test_tongue() {

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLanguageButton');
			});

			kDefaultRoute.OLSKRouteLanguageCodes.filter(function (e) {
				return e !== OLSKRoutingLanguage;
			}).forEach(function (e) {

				const signature = 'OLSKLanguageSwitcherLauncherItemSwitch-' + e;

				before(function () {
					return browser.fill('.LCHLauncherFilterInput', signature);
				});

				it(`shows ${ signature }`, function () {
					browser.assert.elements('.LCHLauncherPipeItem', 1);
				});

			});

			after(function () {
				browser.pressButton('#TestLCHDebugCloseButton');
			});

		});

		describe('KVCWriteLauncherItemImportJSON', function test_KVCWriteLauncherItemImportJSON() {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage,
				});
			});

			context('not filled', function () {
				
				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(async function () {
					return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportSerialized');
				});

				it('alerts if not filled', function () {
					return browser.assert.OLSKAlertText(function () {
						return browser.OLSKPrompt(function () {
							return browser.click('.LCHLauncherPipeItem');
						}, function (dialog) {
							dialog.response = ' ';

							return dialog;
						});
					}, uLocalized('KVCWriteLauncherItemImportJSONErrorNotFilledAlertText'));
				});
			
			});

			context('not json', function () {
				
				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(async function () {
					return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportSerialized');
				});

				it('alerts if not json', function () {
					return browser.assert.OLSKAlertText(function () {
						return browser.OLSKPrompt(function () {
							return browser.click('.LCHLauncherPipeItem');
						}, function (dialog) {
							dialog.response = 'alfa';

							return dialog;
						});
					}, uLocalized('KVCWriteLauncherItemImportJSONErrorNotValidAlertText'));
				});
			
			});

			context('not valid', function () {
				
				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(async function () {
					return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemDebug_PromptFakeImportSerialized');
				});

				it('alerts if not valid', function () {
					return browser.assert.OLSKAlertText(function () {
						return browser.OLSKPrompt(function () {
							return browser.click('.LCHLauncherPipeItem');
						}, function (dialog) {
							dialog.response = JSON.stringify({});

							return dialog;
						});
					}, uLocalized('KVCWriteLauncherItemImportJSONErrorNotValidAlertText'));
				});
			
			});
			
		});

	});

});
