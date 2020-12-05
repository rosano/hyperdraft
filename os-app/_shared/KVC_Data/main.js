import OLSKRemoteStorage from 'OLSKRemoteStorage';

const mod = {

	KVC_DataModuleName () {
		return 'wikiavec';
	},

	KVC_DataModule (inputData, options) {
		return OLSKRemoteStorage.OLSKRemoteStorageDataModuleGenerator(mod.KVC_DataModuleName(), options)(inputData);
	},

};

export default mod;
