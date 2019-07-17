//# OLSKPreinstall

(function OLSKPreinstall() {

	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	(function (param1, param2) {
		return require('glob').sync(`+(${ param1.join('|') })/`, {
			matchBase: true,
			cwd: param2,
		}).forEach(function (e) {
			require('OLSKDisk').OLSKDiskDeleteFolder(require('path').join(param2, e));
		});
	})([
		'OldSkool',
		'OLSK*',
	], require('path').join(__dirname, 'node_modules'));

})();
