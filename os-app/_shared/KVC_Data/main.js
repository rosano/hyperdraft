import OLSKRemoteStorage from 'OLSKRemoteStorage';

const mod = {

	KVC_DataModule (inputData, options) {
		return OLSKRemoteStorage.OLSKRemoteStorageDataModuleGenerator('wikiavec', options)(inputData);
	},

};

export default mod;
