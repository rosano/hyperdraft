const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCRobots_Misc', function () {

	it('sends text', async function () {
		browser.assert.deepEqual(await (await browser.fetch('http://localhost' + kDefaultRoute.OLSKRoutePath)).text(), require('OLSKRobots').OLSKRobotsTXT([
				require('../open-vitrine/controller.js').OLSKControllerRoutes().shift(),
				require('../open-guide/controller.js').OLSKControllerRoutes().shift(),
			].reduce(function (coll, item) {
				return coll.concat(OLSKTestingCanonical(item)).concat((item.OLSKRouteLanguageCodes || []).map(function (e) {
					return OLSKTestingCanonical(item, {
						OLSKRoutingLanguage: e,
					});
				}));
			}, [])));
	});

});
