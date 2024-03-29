const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCWriteLogic = require('./ui-logic.js').default;

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('KVCWrite_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCWriteTitle'));
		});

		it('localizes OLSKNarrowFilterField', function () {
			browser.assert.attribute('.OLSKNarrowFilterField', 'placeholder', uLocalized('KVCWriteFilterFieldText'));
		});

		it('localizes KVCWriteCreateButton', function () {
			browser.assert.attribute(KVCWriteCreateButton, 'title', uLocalized('KVCWriteCreateButtonText'));
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

		it('localizes KVCWriteLauncherItemImportTXT', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemImportTXT', uLocalized('KVCWriteLauncherItemImportTXTText'));
		});

		it('localizes KVCWriteLauncherItemImportNV', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemImportNV', uLocalized('KVCWriteLauncherItemImportNVText'));
		});

		it('localizes KVCWriteLauncherItemExportZIP', function () {
			return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemExportZIP', uLocalized('KVCWriteLauncherItemExportZIPText'));
		});

		describe('OLSKAppToolbarLauncherButton', function test_OLSKAppToolbarLauncherButton () {

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			it('localizes LCHLauncherFilterInput', function () {
				browser.assert.attribute('.LCHLauncherFilterInput', 'placeholder', uLocalized('OLSKWordingTypeToSearch'));
			});

			after(function () {
				return browser.pressButton('#TestLCHDebugCloseButton');
			});

		});

		describe('OLSKAppToolbarLanguageButton', function test_OLSKAppToolbarLanguageButton () {

			before(function () {
				return browser.pressButton('.OLSKAppToolbarLanguageButton');
			});

			it('localizes LCHLauncherFilterInput', function () {
				browser.assert.attribute('.LCHLauncherFilterInput', 'placeholder', uLocalized('OLSKWordingTypeToFilter'));
			});

			after(function () {
				return browser.pressButton('#TestLCHDebugCloseButton');
			});

		});

		context('KVCWriteLauncherItemJournal', function test_KVCWriteLauncherItemJournal () {

			const item = (function(inputData) {
				return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
			})(new Date('2001-02-03T04:05:06Z'));

			before(function () {
				return browser.OLSKLauncherRun('KVCWriteLauncherItemJournal');
			});

			it('sets KVCWriteListItemTitle', function () {
				browser.assert.text('.KVCWriteListItemTitle', uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(item));
			});

			it('sets KVCWriteListItemSnippet', function () {
				browser.assert.text('.KVCWriteListItemSnippet', '-');
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

			it('sets KVCWriteListItemTitle', function () {
				browser.assert.text('.OLSKCollectionItem:nth-child(1) .KVCWriteListItemTitle', item.split('\n').shift());
			});

			it.skip('sets KVCWriteListItemSnippet', function () {
				browser.assert.text('.KVCWriteListItemSnippet', item.split('\n').slice(2).join('\n'));
			});
			
			it.skip('sets KVCNoteBody', function () {
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
				return browser.pressButton('.KVCWriteCreateButton');
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
					return browser.fill('.KVCWriteInputFieldDebug', item1);
				});

				before(function () {
					return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
				});

				it.skip('sets KVCNoteBody', function () {
					browser.assert.input('.KVCWriteInputFieldDebug', KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(date, uLocalized, [item1].map(function (KVCNoteBody) {
						return StubNoteObjectValid({
							KVCNoteBody,
							KVCNoteModificationDate: new Date(),
						});
					})));
				});
			
			});

			context('edit_multiple', function () {
				
				before(async function () {
					return browser.OLSKConfirm(function () {
						return browser.pressButton('.KVCWriteDetailToolbarDiscardButton');
					});
				});

				before(function () {
					return browser.click('.KVCWriteListItem');
				});

				before(function () {
					return browser.fill('.KVCWriteInputFieldDebug', item2);
				});

				before(function () {
					return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
				});

				it.skip('sets KVCNoteBody', function () {
					browser.assert.input('.KVCWriteInputFieldDebug', KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(date, uLocalized, [item2, item1].map(function (KVCNoteBody) {
						console.log([...arguments]);
						return StubNoteObjectValid({
							KVCNoteBody,
							KVCNoteModificationDate: new Date(),
						});
					})));
				});
			
			});
		
		});

		context('archive', function test_archive () {
			
			before(function () {
				return browser.pressButton('.KVCWriteCreateButton');
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

			it('localizes KVCWriteRevealArchiveButton', function () {
				browser.assert.text(KVCWriteRevealArchiveButton, uLocalized('KVCWriteRevealArchiveButtonText'));
			});

			it('localizes KVCWriteLauncherItemRevealArchive', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemRevealArchive', uLocalized('KVCWriteRevealArchiveButtonText'));
			});

		});

		context('connected', function test_connected () {
			
			before(function () {
				return browser.OLSKLauncherRun('ZDRLauncherItemFakeDispatchConnected');
			});

			it('localizes KVCWriteLauncherItemPublishAll', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemPublishAll', uLocalized('KVCWriteLauncherItemPublishAllText'));
			});

			it('localizes KVCWriteLauncherItemRetractAll', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemRetractAll', uLocalized('KVCWriteLauncherItemRetractAllText'));
			});

			it('localizes KVCWriteLauncherItemConfigureCustomDomain', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemConfigureCustomDomain', uLocalized('KVCWriteLauncherItemConfigureCustomDomainText'));
			});

			it('localizes KVCWriteLauncherItemConfigureCustomTemplate', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemConfigureCustomTemplate', uLocalized('KVCWriteLauncherItemConfigureCustomTemplateText'));
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

			context('set_domain', function test_set_domain() {
				
				before(function () {
					return browser.OLSKLauncherRun('FakeConfigureCustomDomain');
				});

				it('localizes KVCWriteLauncherItemRemoveCustomDomain', function () {
					return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemRemoveCustomDomain', uLocalized('KVCWriteLauncherItemRemoveCustomDomainText'));
				});

			});

			context('set_template', function test_set_template() {
				
				before(function () {
					return browser.OLSKLauncherRun('KVCWriteLauncherItemConfigureCustomTemplate');
				});

				it('sets OLSKModalViewTitleText', function () {
					browser.assert.text('.OLSKModalViewTitle', uLocalized('KVCWriteTemplateModalTitleText'));
				});

				context('set', function () {
					
					before(function () {
						browser.fill('.KVCWriteTemplateDataField', Math.random().toString());
					});

					before(function () {
						browser.pressButton('.KVCWriteTemplateUpdateButton');
					});

					before(function () {
						return browser.click('.OLSKModalViewCloseButton');
					});

					it('localizes KVCWriteLauncherItemRemoveCustomTemplate', function () {
						return browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemRemoveCustomTemplate', uLocalized('KVCWriteLauncherItemRemoveCustomTemplateText'));
					});
				
				});
			
			});
		
		});

		describe('OLSKApropos', function test_OLSKApropos() {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage,
				});
			});

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

	});

});
