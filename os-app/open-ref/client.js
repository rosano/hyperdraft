const RemoteStorage = require('remotestoragejs');

exports.WKCRefStorageClient = function () {
	let storageModule = {
		name: 'wikiavec',
		builder (privateClient, publicClient) {
			return {
				exports: {
					WKCRefStorageList () {
						return privateClient.getAll('kvc_notes/');
					},
				},
			};
		},
	};

	let remoteStorage = new RemoteStorage({ modules: [ storageModule ] });

	let outputData = {};

	outputData.remoteStorage = remoteStorage;

	remoteStorage.access.claim(storageModule.name, 'r');

	remoteStorage.caching.enable(`/${storageModule.name}/`);

	outputData[storageModule.name] = remoteStorage[storageModule.name];

	return outputData;
};
