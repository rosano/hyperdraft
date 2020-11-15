exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/write',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKLayoutRender(require('path').join(__dirname, 'ui-view.ejs'), {
				KVCDropboxAppKey: Buffer.from(process.env.KVC_DROPBOX_APP_KEY).toString('base64'),
				KVCGoogleClientKey: Buffer.from(process.env.KVC_GOOGLE_CLIENT_KEY).toString('base64'),
			});
		},
		OLSKRouteLanguages: ['en', 'fr', 'es'],
		OLSKRouteMiddlewares: [
			'KVCSharedDropboxAppKeyGuardMiddleware',
			'KVCSharedGoogleClientKeyGuardMiddleware',
			'KVCSharedDonateLinkGuardMiddleware',
		],
		_OLSKRouteSkipLanguageRedirect: true,
	}, {
		OLSKRoutePath: '/panel/write',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'KVCWriteLegacyRoute',
		OLSKRouteRedirect: '/write',
	}];
};
