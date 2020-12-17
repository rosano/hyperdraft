import KVCNoteModel from './model.js';
import OLSKRemoteStorage from 'OLSKRemoteStorage';

const mod = {

	uFakeNote (inputData) {
		return {
			KVCNoteID: inputData.split('/')[2],
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date(inputData.split('/')[1]),
			KVCNoteModificationDate: new Date(),
		};
	},

	KVCNoteStorageCollectionName () {
		return 'kvc_notes';
	},

	KVCNoteStorageCollectionPath () {
		return mod.KVCNoteStorageCollectionName() + '/';
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

	KVCNoteStorageObjectPathV1 (inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCNoteStorageCollectionPath() + inputData.KVCNoteID;
	},

	KVCNoteStorageMatchV1 (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const item = {
			KVCNoteID: inputData.split('/')[1],
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date(),
			KVCNoteModificationDate: new Date(),
		};

		return inputData === mod.KVCNoteStorageObjectPathV1(item);
	},

	KVCNoteStorageMatch (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const item = mod.uFakeNote(inputData);

		if (KVCNoteModel.KVCNoteModelErrorsFor(item)) {
			return false;
		}

		return inputData === mod.KVCNoteStorageObjectPath(item);
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

			changeDelegate[delegateMethod](OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateData(delegateMethod, event)));
		});

		const OLSKRemoteStorageCollectionExports = {

			async _KVCNoteStorageWrite (inputData) {
				if (typeof inputData !== 'object' || inputData === null) {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				let errors = KVCNoteModel.KVCNoteModelErrorsFor(inputData);
				if (errors) {
					return Promise.resolve({
						KVCErrors: errors,
					});
				}

				if (typeof window !== 'undefined' && window.OLSK_DEMO) {
					return inputData;
				}

				try {
					return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(privateClient, mod.KVCNoteStorageObjectPath(inputData), inputData);
				} catch (e) {
					return Promise.reject(e);
				}
			},

			async _KVCNoteStorageList () {
				return (await Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListingRecursive(privateClient, mod.KVCNoteStorageCollectionPath())).filter(mod.KVCNoteStorageMatch).map(function (e) {
					return privateClient.getObject(e, false);
				}))).reduce(function (coll, item) {
					if (item) {
						coll[item.KVCNoteID] = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(item);
					}

					return coll;
				}, {});
			},

			async _KVCNoteStorageDelete (inputData) {
				if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				if (inputData.KVCNotePublicID) {
					await OLSKRemoteStorageCollectionExports._KVCNoteStoragePublicDelete(mod.KVCNoteStoragePublicObjectPath(inputData));
				}

				return privateClient.remove(mod.KVCNoteStorageObjectPath(inputData));
			},

			async _KVCNoteStorageMigrateV1 (inputData) {
				if (typeof inputData !== 'function') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				return Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListingRecursive(privateClient, mod.KVCNoteStorageCollectionPath())).filter(mod.KVCNoteStorageMatchV1).map(async function (e) {
					const item = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await privateClient.getObject(e, false));
					
					inputData(await OLSKRemoteStorageCollectionExports._KVCNoteStorageWrite(item));

					await privateClient.remove(e);

					return item;
				}));
			},

			async _KVCNoteStoragePublicWrite (param1, param2) {
				if (typeof param1 !== 'string') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				if (param1.trim() === '') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				if (typeof param2 !== 'string') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				await publicClient.getFile(param1); // #purge-hotfix-remotestorage-412 https://github.com/remotestorage/remotestorage.js/issues/1189

				return await publicClient.storeFile('text/html', param1, param2);
			},

			async _KVCNoteStoragePublicDelete (inputData) {
				if (typeof inputData !== 'string') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				if (inputData.trim() === '') {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				return await publicClient.remove(inputData);
			},

			_KVCNoteStoragePublicURL (inputData) {
				if (inputData.trim() === '') {
					throw new Error('KVCErrorInputNotValid');
				}

				return publicClient.getItemURL(inputData);
			},

		};

		return {
			OLSKRemoteStorageCollectionName: mod.KVCNoteStorageCollectionName(),
			OLSKRemoteStorageCollectionExports,
		};
	},

	KVCNoteStorageWrite (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStorageWrite(inputData);
	},

	KVCNoteStorageList (storageClient) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStorageList();
	},

	KVCNoteStorageDelete (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStorageDelete(inputData);
	},

	KVCNoteStorageMigrateV1 (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStorageMigrateV1(inputData);
	},

	KVCNoteStoragePublicObjectPath (inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.KVCNotePublicID) {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.KVCNotePublicID;
	},

	KVCNoteStoragePublicRootPagePath () {
		return 'index.html';
	},

	KVCNoteStoragePublicWrite (storageClient, param1, param2) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStoragePublicWrite(param1, param2);
	},

	KVCNoteStoragePublicDelete (storageClient, param1, param2) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStoragePublicDelete(param1, param2);
	},

	KVCNoteStoragePublicURL (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCNoteStorageCollectionName()]._KVCNoteStoragePublicURL(inputData);
	},

};

export default mod;
