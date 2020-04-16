import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kModuleName = 'wikiavec';

const mod = {

	KVC_DataModule (inputData) {
		return {
			name: kModuleName,
			builder(privateClient, publicClient) {
				privateClient.cache(`${ kModuleName }/`);
				
				return {
					exports: inputData.reduce(function (coll, item) {
						let storage = item(privateClient, publicClient, item.KVCStorageChangeDelegate);

						privateClient.declareType(storage.KVCStorageType, OLSKRemoteStorage.OLSKRemoteStorageJSONSchema(storage.KVCStorageModelErrors));

						coll[storage.KVCStorageCollection] = storage.KVCStorageExports;

						return coll;
					}, {}),
				};
			},
		};
	},

};

export default mod;
