import * as RemoteStoragePackage from 'remotestoragejs';
const RemoteStorage = RemoteStoragePackage.default || RemoteStoragePackage;

export const KVCStorageClient = function (inputData) {
	let remoteStorage = new RemoteStorage(inputData);

	let outputData = {};

	outputData.remoteStorage = remoteStorage;

	inputData.modules.forEach(function (e) {
		remoteStorage.access.claim(e.name, 'rw');

		remoteStorage.caching.enable(`/${ e.name }/`);

		outputData[e.name] = remoteStorage[e.name];
	});

	return outputData;
};
