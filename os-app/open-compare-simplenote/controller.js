exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/compare-simplenote',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCCompareSimplenoteRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'ui-view'), {
				KVCCompareSimplenoteLogic: require('./ui-logic.js'),
			});
		},
		OLSKRouteLanguageCodes: ['en'],
	}];
};
