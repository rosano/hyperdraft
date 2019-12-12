exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/panel/write',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteRoute',
		OLSKRouteFunction (req, res, next) {
			return res.render(require('path').join(__dirname, 'ui-view.ejs'));
		},
		OLSKRouteLanguages: ['en'],
		OLSKRouteMiddlewares: [
			'KVCSharedDonateLinkGuardMiddleware',
		],
	}];
};
