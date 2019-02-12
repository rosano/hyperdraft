var gulpPackage = require('gulp');
var pathPackage = require('path');

var filesystemLibrary = require('OLSKFilesystem');

const NODE_MODULE_NAMES = [
	'normalize.css',
	'd3',
	'OLSKInternational',
	'OLSKRouting',
	'OLSKType',
	'OLSKString',
	'OLSKThrottle',
	'ispinner.css',
	'identicon.js',
	'blueimp-md5',
	'turndown',
	'showdown',
	'moment',
	'url-parse',
	'codemirror',
];

const INTERNAL_PATHS = [
	'WKCParser/main.js',
];

gulpPackage.task('default', gulpPackage.series(function (completionHandler) {
	if (!NODE_MODULE_NAMES.length) {
		return completionHandler();
	}

	filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(pathPackage.join(__dirname, 'os-public/_shared/_external'));

	gulpPackage.src(NODE_MODULE_NAMES.map(function(e) {
		return [
			pathPackage.join('node_modules', e, '**/*.js'),
			pathPackage.join('!node_modules/OLSK*/*-tests.js'),
			pathPackage.join('node_modules', e, '**/*.map'),
			pathPackage.join('node_modules', e, '**/*.css'),
		];
	}).reduce(function(collection, e) {
		return collection.concat(e);
	}), []).pipe(gulpPackage.dest(function(vinylFile) {
		return pathPackage.join('os-public/_shared/_external', vinylFile.path.replace(pathPackage.join(__dirname, 'node_modules'), '').split('/').slice(1).shift());
	}));

	return completionHandler();
}, function (completionHandler) {
	if (!INTERNAL_PATHS.length) {
		return completionHandler();
	}

	filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(pathPackage.join(__dirname, 'os-public/shared-assets/internal'));

	gulpPackage.src(INTERNAL_PATHS.map(function(e) {
		return pathPackage.join('os-app/_shared', e);
	})).pipe(gulpPackage.dest(function(vinylFile) {
		return pathPackage.join('os-public/shared-assets/internal', vinylFile.path.replace(pathPackage.join(__dirname, 'os-app'), '').split('/').slice(2).shift());
	}));

	return completionHandler();
}));
