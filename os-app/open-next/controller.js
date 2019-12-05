exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/panel/write/next',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WIKWriteNextRoute',
		OLSKRouteFunction: function (req, res, next) {
			return res.render(require('path').join(__dirname, 'ui-view.ejs'), {});
		},
		OLSKRouteLanguages: ['en'],
		OLSKRouteMiddlewares: [
			'WKCSharedDonateLinkGuardMiddleware',
		],
	}];
};
