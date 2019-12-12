//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCManifestRoute: {
			OLSKRoutePath: '/manifest.json',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {});
			},
		},
	};
};
