const kWKCServiceWorkerVersionID = process.env.HEROKU_SLUG_COMMIT || Date.now();

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCServiceWorkerRoute: {
			OLSKRoutePath: '/sw.js',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function(req, res, next) {
				return res.type('js').render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view.ejs'), {
					WKCServiceWorkerVersionID: kWKCServiceWorkerVersionID,
				});
			},
		},
	};
};
