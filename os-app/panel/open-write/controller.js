//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WIKWriteRoute: {
			OLSKRoutePath: '/panel/write',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {});
			},
			OLSKRouteLanguages: ['en'],
		},
		WIKRefsRoute: {
			OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: async function(req, res, next) {
				return next();
			},
		},
	};
};
