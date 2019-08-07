//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return process.env.NODE_ENV === 'production' ? {} : {
		WKCWriteSearchInputRoute: {
			OLSKRoutePath: '/modules/WKCWriteSearchInput',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function(req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'));
			},
			OLSKRouteLanguages: ['en'],
		},
	};
};