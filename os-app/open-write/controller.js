//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WIKWriteRoute: {
			OLSKRoutePath: '/panel/write',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'ui-view.ejs'), {});
			},
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedDonateLinkGuardMiddleware',
			],
		},
	};
};
