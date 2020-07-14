const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCWriteLogic = require('./ui-logic.js');

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCWrite_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCWriteTitle'));
		});

		it('localizes KVCWriteLauncherItemJournal', function () {
			browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemJournal', uLocalized('KVCWriteLauncherItemJournalText'));
		});

		context('click OLSKAppToolbarStorageButton', function () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarStorageButton');
			});

			it('localizes KVCWriteStorageExportButton', function () {
				browser.assert.text(KVCWriteStorageExportButton, uLocalized('KVCWriteStorageExportButtonText'));
			});
		
		});

		context('KVCWriteLauncherItemJournal', function () {

			const item = (function(inputData) {
				return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
			})(new Date());

			before(function () {
				return uLaunch('KVCWriteLauncherItemJournal');
			});

			it('sets KVCWriteMasterListItemTitle', function () {
				browser.assert.text('.KVCWriteMasterListItemTitle', uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(item));
			});

			it('sets KVCWriteMasterListItemSnippet', function () {
				browser.assert.text('.KVCWriteMasterListItemSnippet', '-');
			});
			
			before(function () {
				browser.assert.input('.KVCWriteInputFieldDebug', uLocalized('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + KVCWriteLogic.KVCWriteHumanTimestampString(item) + '\n\n- ');
			});
		
		});

		context('connected', function () {
			
			before(function () {
				return uLaunch('FakeStorageIsConnected');
			});

			it('localizes KVCWriteLauncherItemConfigureCustomDomain', function () {
				browser.assert.OLSKLauncherItemText('KVCWriteLauncherItemConfigureCustomDomain', uLocalized('KVCWriteLauncherItemConfigureCustomDomainText'));
			});

			context('KVCWriteLauncherItemConfigureCustomDomain', function () {

				const prompt1 = {};
				const prompt2 = {};
				let confirmQuestion;

				before(function () {
					return browser.pressButton('.OLSKAppToolbarStorageButton');
				});

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

	});

});
