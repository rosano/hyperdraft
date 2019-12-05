<script>
import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKThrottle from 'OLSKThrottle';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting'
import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
import * as WKCNoteAction from '../_shared/WKCNote/action.js';
import * as WKCWriteLogic from './ui-logic.js';
import { storageClient, WKCPersistenceIsLoading, WKCNotesAllStore, WKCNoteSelectedStore } from './persistence.js';

const mod = {

	// VALUE

	_ValueDocumentsAll: [],
	
	_ValueDocumentSelected: undefined,
	
	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveThrottleMap: {},

	// MESSAGE

	WKCWriteFooterDispatchStorage () {
		mod._ValueStorageWidgetHidden = !mod._ValueStorageWidgetHidden;
	},

	WKCWriteMasterDispatchCreate () {
		mod.CommandDocumentCreate();
	},

	WKCWriteMasterDispatchSelect (inputData) {
		mod.CommandDocumentSelect(inputData);
	},

	WIKWriteDetailDispatchBack () {
		mod.CommandDocumentSelect(null);
	},

	WIKWriteDetailDispatchDiscard (inputData) {
		mod.CommandDocumentDiscard(inputData);
	},

	WIKWriteDetailDispatchUpdate () {
		mod.CommandDocumentSave();
	},

	MessageDocumentSelectedDidChange (inputData) {
		if (!inputData) {
			return;
		}

		if (inputData === mod._ValueDocumentSelected) {
			return;
		};

		setTimeout(function () {
			document.querySelector('.WIKWriteDetailFormNameField').focus();
		});

		mod._ValueDocumentSelected = inputData;
	},

	MessageDocumentsAllDidChange() {
		mod._ValueDocumentsAll = $WKCNotesAllStore;
	},

	FooterDispatchExport () {
		CommandDocumentsExport();
	},

	FooterDispatchImport (event) {
		CommandDocumentsImport(event.detail);
	},

	// COMMAND

	CommandDocumentSave() {
		WKCNotesAllStore.update(function (val) {
			return val;
		});

		OLSKThrottle.OLSKThrottleMappedTimeoutFor(mod._ValueSaveThrottleMap, $WKCNoteSelectedStore.WKCNoteID, function (inputData) {
			return {
				OLSKThrottleDuration: 500,
				OLSKThrottleCallback: async function () {
					delete mod._ValueSaveThrottleMap[inputData.WKCNoteID];

					await WKCNoteAction.WKCNoteActionUpdate(storageClient, inputData);
				},
			};
		}, $WKCNoteSelectedStore);

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveThrottleMap[$WKCNoteSelectedStore.WKCNoteID])	
		};
	},

	async CommandDocumentCreate() {
		let item = await WKCNoteAction.WKCNoteActionCreate(storageClient, {
			WKCNoteName: '',
			WKCNoteModificationDate: new Date(),
		});

		WKCNotesAllStore.update(function (val) {
			return val.concat(item).sort(WKCWriteLogic.WKCWriteSort);
		});

		mod.CommandDocumentSelect(item);
	},
	
	CommandDocumentSelect(inputData) {
		return WKCNoteSelectedStore.set(inputData);
	},
	
	async CommandDocumentDiscard (inputData) {
		WKCNotesAllStore.update(function (val) {
			return val.filter(function(e) {
				return e !== inputData;
			});
		});

		await WKCNoteAction.WKCNoteActionDelete(storageClient, inputData.WKCNoteID);

		WKCNoteSelectedStore.set(null);
	},

	async CommandDocumentsExport () {
		let zip = new JSZip();

		const fileName = [
			'com.wikiavec.export',
			(new Date()).toJSON(),
		].join(' ');

		zip.file(`${ fileName }.json`, JSON.stringify({
			WKCNoteObjects: $WKCNotesAllStore,
			WKCSettingObjects: await WKCSettingAction.WKCSettingsActionQuery(storageClient, {}),
		}));
		
		zip.generateAsync({type: 'blob'}).then(function (content) {
			saveAs(content, `${ fileName }.zip`);
		});	
	},

	async CommandDocumentsImport (inputData) {
		let outputData;
		try {
			outputData = JSON.parse(inputData);
		} catch (e)  {
			console.log(e);
		}

		if (typeof outputData !== 'object' || outputData === null) {
			return;
		}

		if (!Array.isArray(outputData.WKCNoteObjects)) {
			return;
		}

		if (!Array.isArray(outputData.WKCSettingObjects)) {
			return;
		}

		await Promise.all(outputData.WKCSettingObjects.map(function (e) {
			return WKCSettingMetal.WKCSettingsMetalWrite(storageClient, e);
		}));

		await Promise.all(outputData.WKCNoteObjects.map(function (e) {
			return WKCNoteMetal.WKCNoteMetalWrite(storageClient, WKCNoteModelPostJSONParse(e));
		}));

		WKCNotesAllStore.set(await WKCNoteAction.WKCNoteActionQuery(storageClient, {}));
	},

	// SETUP

	SetupEverything () {
		mod.SetupStorageWidget();

		mod.SetupStorageStatus();
	},

	SetupStorageWidget () {
		(new window.OLSKStorageWidget(storageClient.remoteStorage)).attach('WKCWriteStorageWidget').backend(document.querySelector('.WKCWriteFooterStorageButton'));
	},

	SetupStorageStatus () {
		OLSKRemoteStorage.OLSKRemoteStorageStatus(storageClient.remoteStorage, function (inputData) {
			mod._ValueFooterStorageStatus = inputData;
		}, OLSKLocalized)
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

};

WKCNotesAllStore.subscribe(mod.MessageDocumentsAllDidChange);

WKCNoteSelectedStore.subscribe(mod.MessageDocumentSelectedDidChange);

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

import OLSKViewportContent from 'OLSKViewportContent';
import WKCWriteMaster from './submodules/WKCWriteMaster/main.svelte';
import WIKWriteDetail from './submodules/WIKWriteDetail/main.svelte';
import WKCWriteFooter from './submodules/WKCWriteFooter/main.svelte';
import OLSKServiceWorker from '../_shared/__external/OLSKServiceWorker/main.svelte';
</script>

<div class="WKCWrite OLSKViewport" class:OLSKIsLoading={ $WKCPersistenceIsLoading }>

<OLSKViewportContent>
	<WKCWriteMaster WKCWriteMasterListItems={ mod._ValueDocumentsAll } WKCWriteMasterListItemSelected={ $WKCNoteSelectedStore } WKCWriteMasterDispatchCreate={ mod.WKCWriteMasterDispatchCreate } WKCWriteMasterDispatchSelect={ mod.WKCWriteMasterDispatchSelect } OLSKMobileViewInactive={ $WKCNoteSelectedStore } />
	
	<WIKWriteDetail WIKWriteDetailItem={ $WKCNoteSelectedStore } WIKWriteDetailDispatchBack={ mod.WIKWriteDetailDispatchBack } WIKWriteDetailDispatchDiscard={ mod.WIKWriteDetailDispatchDiscard } WIKWriteDetailDispatchUpdate={ mod.WIKWriteDetailDispatchUpdate } OLSKMobileViewInactive={ !$WKCNoteSelectedStore } />
</OLSKViewportContent>

<div id="WKCWriteStorageWidget" class="OLSKMobileViewFooter" class:WKCWriteStorageWidgetHidden={ mod._ValueStorageWidgetHidden }></div>

<WKCWriteFooter on:FooterDispatchExport={ mod.FooterDispatchExport } on:FooterDispatchImport={ mod.FooterDispatchImport } WKCWriteFooterStorageStatus={ mod._ValueFooterStorageStatus } WKCWriteFooterDispatchStorage={ mod.WKCWriteFooterDispatchStorage } />

</div>

{#if !OLSK_TESTING_BEHAVIOUR()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style src="./ui-style.css"></style>
