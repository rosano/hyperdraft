const kWKCServiceWorkerVersionID = process.env.HEROKU_SLUG_COMMIT || Date.now().toString();

exports.OLSKControllerRoutes = function() {
	return {
		WKCServiceWorkerRoute: {
			OLSKRoutePath: '/sw.js',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction (req, res, next) {
				return res.type('js').send(require('OLSKServiceWorker').OLSKServiceWorkerView({
					VERSION_ID_TOKEN: kWKCServiceWorkerVersionID,
					ORIGIN_PAGE_PATH_TOKEN: require('../open-write/controller.js').OLSKControllerRoutes().shift().OLSKRoutePath,
				}));
			},
		},
	};
};
