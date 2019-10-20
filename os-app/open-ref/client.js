const RemoteStorage = require('remotestoragejs');

exports.WKCRefStorageClient = function () {
	let modules = [{
		name: 'wikiavec',
		builder (privateClient, publicClient) {
			return {
				exports: {
					WKCRefStorageList () {
						return privateClient.getAll('wkc_notes/');
					},
				},
			};
		},
	}];

	let remoteStorage = new RemoteStorage({
		modules: modules,
	});

	let outputData = {};

	outputData.remoteStorage = remoteStorage;

	modules.forEach(function (e) {
		remoteStorage.access.claim(e.name, 'r');

		remoteStorage.caching.enable(`/${e.name}/`);

		outputData[e.name] = remoteStorage[e.name];
	});

	return outputData;
};
