import { _WIKIsTestingBehaviour } from '../../_shared/common/global.js';

import * as WKXStorageClient from '../../_shared/WKXStorageClient/main.js';
import { WKXStorageModule } from '../../_shared/WKXStorageModule/main.js';
import { WKXDocumentStorage } from '../../_shared/WKXDocument/storage.js';
import { WKXDocumentActionQuery } from '../../_shared/WKXDocument/action.js';
import { WKCSettingStorage } from '../../_shared/WKCSetting/storage.js';
import { WKXVersionStorage } from '../../_shared/WKXVersion/storage.js';

import { WKCWriteLogicListSort } from './ui-logic.js';


import { noteSelected } from './_shared.js';

import { writable } from 'svelte/store';

export const notesAll = writable([]);
export const mobileViewCurrent = writable('ModuleMaster');
export const isLoading = writable(true);
export let filterText = writable('');
export const isInErrorState = writable(false);

export const defaultFocusNode = function () {
	return document.querySelector('.WKCWriteFilterInput');
};

export const isMobile = function () {
	return window.innerWidth <= 760;
};

let _noteSelected;
noteSelected.subscribe(function (val) {
	_noteSelected = val;
});
export const storageClient = WKXStorageClient.WKXStorageClient({
	modules: [
		WKXStorageModule([
			WKXDocumentStorage,
			WKXVersionStorage,
			WKCSettingStorage,
			].map(function (e) {
				return {
					WKXCollectionStorageGenerator: e,
					WKXCollectionChangeDelegate: e === WKXDocumentStorage ? {
						OLSKChangeDelegateCreate: function (inputData) {
							console.log('OLSKChangeDelegateCreate', inputData);

							notesAll.update(function (val) {
								return val.filter(function (e) { // @Hotfix Dropbox sending DelegateAdd
									return e.WKCNoteID !== inputData.WKCNoteID;
								}).concat(inputData).sort(WKCWriteLogicListSort);
							});
						},
						OLSKChangeDelegateUpdate: function (inputData) {
							console.log('OLSKChangeDelegateUpdate', inputData);

							if (_noteSelected && (_noteSelected.WKCNoteID === inputData.WKCNoteID)) {
								noteSelected.update(function (val) {
									return Object.assign(val, inputData);
								});
							}

							notesAll.update(function (val) {
								return val.map(function (e) {
									return Object.assign(e, e.WKCNoteID === inputData.WKCNoteID ? inputData : {});
								});
							});
						},
						OLSKChangeDelegateDelete: function (inputData) {
							console.log('OLSKChangeDelegateDelete', inputData);

							if (_noteSelected && (_noteSelected.WKCNoteID === inputData.WKCNoteID)) {
								noteSelected.set(null);
							}

							notesAll.update(function (val) {
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

let remoteStorage = storageClient.remoteStorage;

remoteStorage.on('ready', async () => {
	if (!_WIKIsTestingBehaviour()) {
		console.debug('ready', arguments);
	}

	await remoteStorage.wikiavec.wkc_documents.init();
	// await remoteStorage.wikiavec.wkc_settings.init();
	// await remoteStorage.wikiavec.wkc_versions.init();
	notesAll.set((await WKXDocumentActionQuery(storageClient, {})).sort(WKCWriteLogicListSort));

	isLoading.set(false);

	setTimeout(function () {
		defaultFocusNode().focus();
	});
});

(function SetupStorageClientLogging() {
	remoteStorage.on('not-connected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('not-connected', arguments);
		}
	});

	remoteStorage.on('disconnected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('disconnected', arguments);
		}
	});

	remoteStorage.on('connected', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('connected', arguments);
		}
	});

	remoteStorage.on('error', (error) => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('error', error);
		}

		isInErrorState.set(true);
	});

	remoteStorage.on('network-offline', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('network-offline', arguments);
		}
	});

	remoteStorage.on('network-online', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('network-online', arguments);
		}
	});

	remoteStorage.on('sync-done', () => {
		if (!_WIKIsTestingBehaviour()) {
			console.debug('sync-done', arguments);
		}
	});
})();
