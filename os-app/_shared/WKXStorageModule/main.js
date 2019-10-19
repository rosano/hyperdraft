import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

export const WKXStorageModule = function (inputData) {
	return {
		name: 'wikiavec',
		builder: function(privateClient, publicClient) {
			return {
				exports: inputData.reduce(function (coll, item) {
					let storage = item.WKXCollectionStorageGenerator(privateClient, publicClient, item.WKXCollectionChangeDelegate);

					privateClient.declareType(storage.WKXStorageType, OLSKRemoteStorage.OLSKRemoteStorageJSONSchema(storage.WKXStorageModelErrors));

					coll[storage.WKXStorageCollection] = storage.WKXStorageExports;

					return coll;
				}, {}),
			};
		},
	};
};
