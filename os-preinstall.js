//# OLSKPreinstallPurgeOLSK

(function OLSKPreinstallPurgeOLSK() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	try {
		const OLSKDisk = require('OLSKDisk');
	} catch (e) {
		return console.warn('error requiring OLSKDisk');
	}

	(function (param1, param2) {
		return require('glob').sync(`+(${ param1.join('|') })/`, {
			matchBase: true,
			cwd: param2,
		}).forEach(function (e) {
			OLSKDisk.OLSKDiskDeleteFolder(require('path').join(param2, e));
		});
	})([
		'OLSK*',
	], require('path').join(__dirname, 'node_modules'));

})();
