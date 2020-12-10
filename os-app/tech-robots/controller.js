exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/robots.txt',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCRobotsRoute',
		OLSKRouteFunction (req, res, next) {
			return res.send(require('OLSKRobots').OLSKRobotsTXT([
				'KVCVitrineRoute',
			].reduce(function (coll, item) {
				return coll.concat(res.locals.OLSKCanonical(item)).concat((res.locals.OLSKRouteObjectFor(item).OLSKRouteLanguageCodes || []).map(function (e) {
					return res.locals.OLSKCanonicalLocalizedFor(item, {
						OLSKRoutingLanguage: e,
					});
				}));
			}, [])));
		},
	}];
};
