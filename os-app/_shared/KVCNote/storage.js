import KVCNoteModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const kType = 'kvc_note';
const kCollection = 'kvc_notes';

const mod = {

	uFakeNote (inputData) {
		return {
			KVCNoteID: inputData.split('/')[2],
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date(inputData.split('/')[1]),
			KVCNoteModificationDate: new Date(),
		};
	},

	KVCNoteStorageCollectionPath () {
		return kCollection + '/';
	},

	KVCNoteStorageFolderPath (inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCNoteStorageCollectionPath() + inputData.KVCNoteCreationDate.toJSON().split('T').shift() + '/' + inputData.KVCNoteID + '/';

		return mod.KVCNoteStorageCollectionPath() + inputData + '/';
	},

	KVCNoteStorageObjectPath (inputData) {
		return mod.KVCNoteStorageFolderPath(inputData) + 'main';
	},

	KVCNoteStorageMatch (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData === mod.KVCNoteStorageObjectPath(mod.uFakeNote(inputData));
	},

	KVCNoteStorageBuild (privateClient, publicClient, changeDelegate) {
		privateClient.on('change', function (event) {
			if (!changeDelegate) {
				return;
			}
			
			const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

			if (!delegateMethod) {
				return;
			}

			if (typeof changeDelegate[delegateMethod] !== 'function') {
				return console.warn(`${ delegateMethod } not function`);
			}

			if (!mod.KVCNoteStorageMatch(event.relativePath)) {
				return;
			}

			if (event.origin === 'remote' && event.oldValue && event.newValue) {
				// #hotfix-remotestorage-remote-event-from-local-change
				if (JSON.stringify(event.oldValue) === JSON.stringify(event.newValue)) {
					return console.info('RemoteIdentical', event);
				}
			}

			changeDelegate[delegateMethod](OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
		});

		const OLSKRemoteStorageCollectionExports = {

			async KVCStorageList () {
				let storagePath = mod.KVCNoteStorageCollectionPath();

				return (await Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListObjectsRecursive(privateClient, storagePath)).filter(mod.KVCNoteStorageMatch).map(function (e) {
					return privateClient.getObject(e, false);
				}))).reduce(function (coll, item) {
					if (item) {
						coll[item.KVCNoteID] = item;
					}

					return coll;
				}, {});
			},

			async KVCStorageWrite (inputData) {
				await privateClient.storeObject(kType, mod.KVCNoteStorageObjectPath(inputData), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(inputData));
				return OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData);
			},
			
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCNoteStorageObjectPath(inputData));
			},

		};

		return {
			OLSKRemoteStorageCollectionName: kCollection,
			OLSKRemoteStorageCollectionType: kType,
			OLSKRemoteStorageCollectionModelErrors: Object.entries(KVCNoteModel.KVCNoteModelErrorsFor({}, {
				KVCOptionValidateIfNotPresent: true,
			})).map(function (e) {
				if (!Object.keys(KVCNoteModel.KVCNoteModelErrorsFor({})).includes(e[0])) {
					e[1].push('__RSOptional');
				}

				return e;
			}).reduce(function (coll, item) {
				coll[item[0]] = item[1];

				return coll;
			}, {}),
			OLSKRemoteStorageCollectionExports,
		};
	},

};

export default mod;
