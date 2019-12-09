import { _WIKIsTestingBehaviour } from '../_shared/common/global.js';

import * as WKCStorageClient from '../_shared/WKCStorageClient/main.js';
import { WKCStorageModule } from '../_shared/WKCStorageModule/main.js';
import { WKCNoteStorage } from '../_shared/WKCNote/storage.js';
import { WKCNoteActionQuery } from '../_shared/WKCNote/action.js';
import { WKCSettingStorage } from '../_shared/WKCSetting/storage.js';
import { WKCVersionStorage } from '../_shared/WKCVersion/storage.js';

import { WKCWriteLogicListSort } from './ui-logic.js';

import { writable } from 'svelte/store';

export const WKCNoteSelectedStore = writable(null);
export const WKCNotesAllStore = writable([]);
export const mobileViewCurrent = writable('ModuleMaster');
export const WKCPersistenceIsLoading = writable(true);
export let filterText = writable('');
export const isInErrorState = writable(false);

export const WKCWriteDefaultFocusNode = function () {
	return document.querySelector('.WKCWriteMasterFilterField');
};

let _WKCNoteSelectedStore;
WKCNoteSelectedStore.subscribe(function (val) {
	_WKCNoteSelectedStore = val;
});
export const storageClient = WKCStorageClient.WKCStorageClient({
	modules: [
		WKCStorageModule([
			WKCNoteStorage,
			WKCVersionStorage,
			WKCSettingStorage,
			].map(function (e) {
				return {
					WKCCollectionStorageGenerator: e,
					WKCCollectionChangeDelegate: e === WKCNoteStorage ? {
						OLSKChangeDelegateCreate (inputData) {
							// console.log('OLSKChangeDelegateCreate', inputData);

							WKCNotesAllStore.update(function (val) {
								return val.filter(function (e) { // @Hotfix Dropbox sending DelegateAdd
									return e.WKCNoteID !== inputData.WKCNoteID;
								}).concat(inputData).sort(WKCWriteLogicListSort);
							});
						},
						OLSKChangeDelegateUpdate (inputData) {
							// console.log('OLSKChangeDelegateUpdate', inputData);

							if (_WKCNoteSelectedStore && (_WKCNoteSelectedStore.WKCNoteID === inputData.WKCNoteID)) {
								WKCNoteSelectedStore.update(function (val) {
									return Object.assign(val, inputData);
								});
							}

							WKCNotesAllStore.update(function (val) {
								return val.map(function (e) {
									return Object.assign(e, e.WKCNoteID === inputData.WKCNoteID ? inputData : {});
								});
							});
						},
						OLSKChangeDelegateDelete (inputData) {
							// console.log('OLSKChangeDelegateDelete', inputData);

							if (_WKCNoteSelectedStore && (_WKCNoteSelectedStore.WKCNoteID === inputData.WKCNoteID)) {
								WKCNoteSelectedStore.set(null);
							}

							WKCNotesAllStore.update(function (val) {
								return val.filter(function (e) {
									return e.WKCNoteID !== inputData.WKCNoteID;
								});
							});
						},
					} : null,
				}
			})),
	],
});

storageClient.remoteStorage.on('ready', async () => {
	if (!_WIKIsTestingBehaviour()) {
		console.debug('ready', arguments);
	}

	await storageClient.remoteStorage.wikiavec.wkc_notes.WKCNoteStorageCache();
	await storageClient.remoteStorage.wikiavec.wkc_settings.WKCSettingStorageCache();
	await storageClient.remoteStorage.wikiavec.wkc_versions.WKCVersionStorageCache();
	WKCNotesAllStore.set((await WKCNoteActionQuery(storageClient, {})).sort(WKCWriteLogicListSort));

	WKCPersistenceIsLoading.set(false);

	if (isMobile()) {
		return;
	};

	setTimeout(function () {
		WKCWriteDefaultFocusNode().focus();
	});
});

(function SetupStorageClientLogging() {
	storageClient.remoteStorage.on('not-connected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('not-connected', arguments);
		}
	});

	storageClient.remoteStorage.on('disconnected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('disconnected', arguments);
		}
	});

	storageClient.remoteStorage.on('connected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('connected', arguments);
		}
	});

	storageClient.remoteStorage.on('sync-done', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('sync-done', arguments);
		}
	});

	let isOffline;

	storageClient.remoteStorage.on('network-offline', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('network-offline', arguments);
		}

		isOffline = true;
	});

	storageClient.remoteStorage.on('network-online', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('network-online', arguments);
		}
		
		isOffline = false;
	});

	storageClient.remoteStorage.on('error', (error) => {
		if (isOffline && inputData.message === 'Sync failed: Network request failed.') {
			return;
		};

		if (!_WIKIsTestingBehaviour()) {
			console.debug('error', error);
		}

		isInErrorState.set(true);
	});
})();
