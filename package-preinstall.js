//# OLSKPreinstallPurgeOLSK

(function OLSKPreinstallPurgeOLSK() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	try {
		require('glob');
	} catch(e) {
		return console.log(e);
	}

	(function (param1, param2) {
		return require('glob').sync(`+(${ param1.join('|') })/`, {
			matchBase: true,
			cwd: param2,
		}).forEach(function (e) {
			try {
				require('OLSKDisk').OLSKDiskDeleteFolder(require('path').join(param2, e));
			} catch (e) {
				console.warn('error deleting folder');
			}
		});
	})([
		'OLSK*',
		'ROCO*',
		'launchlet',
		'MassageTXT',
	], require('path').join(__dirname, 'node_modules'));

})();
