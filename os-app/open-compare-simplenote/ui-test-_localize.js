const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('KVCCompareSimplenote_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCCompareSimplenoteTitle'));
		});

		it('localizes meta[description]', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('KVCCompareSimplenoteDescription'));
		});

		it('localizes KVCCompareSimplenoteHeading', function () {
			browser.assert.text(KVCCompareSimplenoteHeading, uLocalized('KVCCompareSimplenoteTitle'));
		});

		it('localizes KVCCompareSimplenoteIntro', function () {
			browser.assert.text(KVCCompareSimplenoteIntro, uLocalized('KVCCompareSimplenoteIntroText'));
		});

		it('localizes KVCCompareSimplenoteContrast', function () {
			browser.assert.text(KVCCompareSimplenoteContrast, uLocalized('KVCCompareSimplenoteContrastText'));
		});

		it('localizes KVCCompareSimplenoteTableHeadingFeature', function () {
			browser.assert.text(KVCCompareSimplenoteTableHeadingFeature, uLocalized('KVCCompareSimplenoteTableHeadingFeatureText'));
		});

		describe('KVCCompareSimplenoteTableRowFeature', function test_KVCCompareSimplenoteTableRowFeature () {

			it('localizes KVCCompareSimplenoteTableRowFeature', function () {
				browser.assert.text(KVCCompareSimplenoteTableRowFeature, Object.values(uLocalized('KVCCompareSimplenoteFeatureList')).join(''));
			});
			
		});

		describe('KVCCompareSimplenoteTableRowHyperdraftCaption', function test_KVCCompareSimplenoteTableRowHyperdraftCaption () {

			it('localizes KVCCompareSimplenoteTableRowHyperdraftCaption', function () {
				browser.assert.text(KVCCompareSimplenoteTableRowHyperdraftCaption, Object.values(uLocalized('KVCCompareSimplenoteFeatureListCaption')).reduce(function (coll, item) {
					return coll.concat(item[0] ? item[0] : []);
				}, []).join(''));
			});
			
		});

		describe('KVCCompareSimplenoteTableRowSimplenoteCaption', function test_KVCCompareSimplenoteTableRowSimplenoteCaption () {

			it('localizes KVCCompareSimplenoteTableRowSimplenoteCaption', function () {
				browser.assert.text(KVCCompareSimplenoteTableRowSimplenoteCaption, Object.values(uLocalized('KVCCompareSimplenoteFeatureListCaption')).reduce(function (coll, item) {
					return coll.concat(item[1] ? item[1] : []);
				}, []).join(''));
			});
			
		});

		it('localizes KVCCompareSimplenoteActionHeading', function () {
			browser.assert.text(KVCCompareSimplenoteActionHeading, uLocalized('KVCCompareSimplenoteActionHeadingText'));
		});

		it('localizes KVCCompareSimplenoteActionButton', function () {
			browser.assert.text(KVCCompareSimplenoteActionButton, uLocalized('OLSKWordingOpenApp'));
		});

	});

});
