import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kModuleName = 'wikiavec';

export const KVCStorageModule = function (inputData) {
	return {
		name: kModuleName,
		builder(privateClient, publicClient) {
			privateClient.cache(`${ kModuleName }/`);
			
			return {
				exports: inputData.reduce(function (coll, item) {
					let storage = item(privateClient, publicClient, item.KVCCollectionChangeDelegate);

					privateClient.declareType(storage.KVCStorageType, OLSKRemoteStorage.OLSKRemoteStorageJSONSchema(storage.KVCStorageModelErrors));

					coll[storage.KVCStorageCollection] = storage.KVCStorageExports;

					return coll;
				}, {}),
			};
		},
	};
};
