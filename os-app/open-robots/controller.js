//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRobotsRoute: {
			OLSKRoutePath: '/robots.txt',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function(req, res, next) {
				return res.render([
					__dirname,
					'view',
				].join('/'), {
					WKCRobotsAllowedRouteConstants: process.env.WKC_ROBOTS_ALLOWED === 'true' ? [
						'WKCRouteHome',
					] : [],
				});
			},
		},
	};
};
