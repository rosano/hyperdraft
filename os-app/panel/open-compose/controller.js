//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WIKComposeRoute: {
			OLSKRoutePath: '/panel/write',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {});
			},
			OLSKRouteLanguages: ['en'],
		},
	};
};
