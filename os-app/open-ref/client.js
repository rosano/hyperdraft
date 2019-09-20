exports.WKCRefNotesModule = function () {
	return {
		name: 'wkc_notes',
		builder: function(privateClient, publicClient) {
			privateClient.declareType('wkc_note', require('OLSKRemoteStorage').OLSKRemoteStorageJSONSchema({}));

			return {
				exports: {
					listObjects: function () {
						return privateClient.getAll('');
					},
				},
			};
		},
	};
};

const RemoteStorage = require('remotestoragejs');

exports.WKCRefStorageClient = function () {
	let modules = [exports.WKCRefNotesModule()];

	let remoteStorage = new RemoteStorage({
		modules: modules,
	});

	let outputData = {};

	outputData.remoteStorage = remoteStorage;

	modules.forEach(function (e) {
		remoteStorage.access.claim(e.name, 'rw');

		remoteStorage.caching.enable(`/${e.name}/`);

		outputData[e.name] = remoteStorage[e.name];
	});

	return outputData;
};
