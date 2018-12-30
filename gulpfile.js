var gulpPackage = require('gulp');
var pathPackage = require('path');

var filesystemLibrary = require('OLSKFilesystem');

gulpPackage.task('default', gulpPackage.series(function (completionHandler) {
	filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(pathPackage.join(__dirname, 'os-public/shared-assets/internal'));
	filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(pathPackage.join(__dirname, 'os-public/shared-assets/external'));

	gulpPackage.src([
	].map(function(e) {
		return pathPackage.join('os-app', e);
	})).pipe(gulpPackage.dest(function(vinylFile) {
		return pathPackage.join('os-public/shared-assets/internal', vinylFile.path.replace(pathPackage.join(__dirname, 'os-app'), '').split('/').slice(1).shift());
	}));

	gulpPackage.src([
		'normalize.css',
		'd3',
		'OLSKTasks',
		'OLSKInternational',
		'OLSKRouting',
		'OLSKType',
		'OLSKString',
		'ispinner.css',
		'identicon.js',
		'blueimp-md5',
		'turndown',
		'showdown',
		'moment',
		'url-parse',
	].map(function(e) {
		return [
			pathPackage.join('node_modules', e, '**/*.js'),
			pathPackage.join('!node_modules/OLSK*/*-tests.js'),
			pathPackage.join('node_modules', e, '**/*.map'),
			pathPackage.join('node_modules', e, '**/*.css'),
		];
	}).reduce(function(collection, e) {
		return collection.concat(e);
	}), []).pipe(gulpPackage.dest(function(vinylFile) {
		return pathPackage.join('os-public/shared-assets/external', vinylFile.path.replace(pathPackage.join(__dirname, 'node_modules'), '').split('/').slice(1).shift());
	}));

	return completionHandler();
}));
