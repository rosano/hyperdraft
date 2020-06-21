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

		context('click OLSKAppToolbarStorageButton', function () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarStorageButton');
			});

			it('localizes KVCWriteStorageExportButton', function () {
				browser.assert.text(KVCWriteStorageExportButton, uLocalized('KVCWriteStorageExportButtonText'));
			});
		
		});

		context('KVCWriteLauncherItemJournal', function () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			before(function () {
				return browser.fill('.LCHLauncherFilterInput', 'KVCWriteLauncherItemJournal');
			});

			it('localizes KVCWriteLauncherItemJournal', function () {
				browser.assert.text('.LCHLauncherResultListItem', uLocalized('KVCWriteLauncherItemJournalText'));
			});

			context('click', function () {

				const item = (function(inputData) {
					return (new Date(Date.parse(inputData) - inputData.getTimezoneOffset() * 1000 * 60));
				})(new Date());

				before(function () {
					return browser.click('.LCHLauncherResultListItem');
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
		
		});

	});

});
