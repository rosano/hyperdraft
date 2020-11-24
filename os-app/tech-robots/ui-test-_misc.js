const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCRobots_Misc', function () {

	it('sends text', async function () {
		browser.assert.deepEqual(await (await browser.fetch('http://loc.tests' + kDefaultRoute.OLSKRoutePath)).text(), require('OLSKRobots').OLSKRobotsTXT([
				require('../open-vitrine/controller.js').OLSKControllerRoutes().shift(),
			].reduce(function (coll, item) {
				return coll.concat(OLSKTestingCanonical(item)).concat((item.OLSKRouteLanguages || []).map(function (e) {
					return OLSKTestingCanonical(item, {
						OLSKRoutingLanguage: e,
					});
				}));
			}, [])));
	});

});
