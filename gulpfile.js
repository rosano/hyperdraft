var gulpPackage = require('gulp');
var pathPackage = require('path');
var filesystemLibrary = require('OLSKFilesystem');

function clean(callback) {
	filesystemLibrary.OLSKFilesystemHelpDeleteDirectoryRecursive(pathPackage.join(__dirname, 'os-public/shared-assets/vendor'));
	return callback();
}

function install() {
	return gulpPackage.src([
		'normalize.css',
		'd3',
		'OLSKTasks',
		'ispinner.css',
		'turndown',
		'showdown',
		'moment',
	].map(function(e) {
		return [
			[
				'node_modules',
				e,
				'**/*.js',
			].join('/'), [
				'node_modules',
				e,
				'**/*.css',
			].join('/')
		];
	}).reduce(function(collection, e) {
		return collection.concat(e);
	}), []).pipe(gulpPackage.dest(function(vinylFile) {
		return pathPackage.join('os-public/shared-assets/vendor/', vinylFile.path.replace(pathPackage.join(__dirname, 'node_modules/'), '').split('/').shift());
	}));
}

var build = gulpPackage.series(clean, install);

gulpPackage.task('default', build);
