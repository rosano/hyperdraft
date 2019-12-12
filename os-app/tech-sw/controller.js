const kWKCServiceWorkerVersionID = process.env.HEROKU_SLUG_COMMIT || Date.now();

const OLSKServiceWorker = require('../_shared/__external/OLSKServiceWorker/main.js');

exports.OLSKControllerRoutes = function() {
	return {
		WKCServiceWorkerRoute: {
			OLSKRoutePath: '/sw.js',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction (req, res, next) {
				return res.type('js').send(OLSKServiceWorker.OLSKServiceWorkerView({
					VERSION_ID_TOKEN: kWKCServiceWorkerVersionID.toString(),
					REFERRER_MATCH_TOKEN: require('../open-write/controller.js').OLSKControllerRoutes().shift().OLSKRoutePath.replace(/\//g, '\\/'),
				}));
			},
		},
	};
};
