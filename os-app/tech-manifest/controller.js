exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/manifest.json',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'WKCManifestRoute',
		OLSKRouteFunction (req, res, next) {
			return res.json({
				name: 'Hyperdraft',
				short_name: 'Hyperdraft',
				start_url: res.locals.OLSKCanonical('KVCWriteRoute'),
				display: 'standalone',
				background_color: 'white',
				theme_color: 'white',
				icons: [{
					src: process.env.OLSK_LAYOUT_TOUCH_ICON_URL,
					sizes: '600x600',
					type: 'image/png',
					purpose: 'any maskable',
				}],
			});
		},
	}];
};
