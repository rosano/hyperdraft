import * as RemoteStoragePackage from 'remotestoragejs';
const RemoteStorage = RemoteStoragePackage.default || RemoteStoragePackage;

export const WIKStorageClientForModules = function (modules) {
	let remoteStorage = new RemoteStorage({
		modules: modules,
	});

	let outputData = {};

	outputData.remoteStorage = remoteStorage;

	modules.forEach(function (e) {
		remoteStorage.access.claim(e.name, 'rw');

		remoteStorage.caching.enable(`/${ e.name }/`);

		outputData[e.name] = remoteStorage[e.name];
	});

	return outputData;
};
