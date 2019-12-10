import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

export const KVCStorageModule = function (inputData) {
	return {
		name: 'wikiavec',
		builder(privateClient, publicClient) {
			return {
				exports: inputData.reduce(function (coll, item) {
					let storage = item.KVCCollectionStorageGenerator(privateClient, publicClient, item.KVCCollectionChangeDelegate);

					privateClient.declareType(storage.KVCStorageType, OLSKRemoteStorage.OLSKRemoteStorageJSONSchema(storage.KVCStorageModelErrors));

					coll[storage.KVCStorageCollection] = storage.KVCStorageExports;

					return coll;
				}, {}),
			};
		},
	};
};
