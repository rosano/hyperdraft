import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

export const WKCStorageModule = function (inputData) {
	return {
		name: 'wikiavec',
		builder(privateClient, publicClient) {
			return {
				exports: inputData.reduce(function (coll, item) {
					let storage = item.WKCCollectionStorageGenerator(privateClient, publicClient, item.WKCCollectionChangeDelegate);

					privateClient.declareType(storage.WKCStorageType, OLSKRemoteStorage.OLSKRemoteStorageJSONSchema(storage.WKCStorageModelErrors));

					coll[storage.WKCStorageCollection] = storage.WKCStorageExports;

					return coll;
				}, {}),
			};
		},
	};
};
