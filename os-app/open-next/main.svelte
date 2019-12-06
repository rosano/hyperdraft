<script>
import OLSKInternational from 'OLSKInternational';
export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKThrottle from 'OLSKThrottle';
import WKCParser from '../_shared/WKCParser/main.js';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting'
import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
import * as WKCNoteAction from '../_shared/WKCNote/action.js';
import * as WKCWriteLogic from '../open-write/ui-logic.js';
import { storageClient, WKCPersistenceIsLoading, WKCNotesAllStore } from '../open-write/persistence.js';

const mod = {

	// VALUE

	_ValueNotesAll: [],
	
	_ValueNoteSelected: undefined,
	
	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveThrottleMap: {},

	WIKWriteDetailInstance: undefined,

	// DATA

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	// MESSAGE

	WKCWriteFooterDispatchStorage () {
		mod._ValueStorageWidgetHidden = !mod._ValueStorageWidgetHidden;
	},

	WKCWriteMasterDispatchCreate (inputData) {
		mod.CommandNoteCreate(inputData);
	},

	WKCWriteMasterDispatchSelect (inputData) {
		mod.CommandNoteSelect(inputData);
	},

	WKCWriteMasterDelegateItemTitle (inputData) {
		return WKCParser.WKCParserTitleForPlaintext(inputData.WKCNoteBody);
	},

	WIKWriteDetailDispatchBack () {
		mod.CommandNoteSelect(null);
	},

	WIKWriteDetailDispatchDiscard (inputData) {
		mod.CommandNoteDiscard(inputData);
	},

	WIKWriteDetailDispatchUpdate (inputData) {
		mod._ValueNoteSelected.WKCNoteBody = inputData;
		
		mod.CommandNoteSave();
	},

	WIKWriteDetailDispatchOpen () {},

	MessageNotesAllDidChange() {
		mod._ValueNotesAll = $WKCNotesAllStore;
	},

	FooterDispatchExport () {
		CommandNotesExport();
	},

	FooterDispatchImport (event) {
		CommandNotesImport(event.detail);
	},

	// COMMAND

	CommandNoteSave() {
		WKCNotesAllStore.update(function (val) {
			return val;
		});

		OLSKThrottle.OLSKThrottleMappedTimeoutFor(mod._ValueSaveThrottleMap, mod._ValueNoteSelected.WKCNoteID, function (inputData) {
			return {
				OLSKThrottleDuration: 500,
				async OLSKThrottleCallback () {
					delete mod._ValueSaveThrottleMap[inputData.WKCNoteID];

					await WKCNoteAction.WKCNoteActionUpdate(storageClient, inputData);
				},
			};
		}, mod._ValueNoteSelected);

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveThrottleMap[mod._ValueNoteSelected.WKCNoteID])	
		};
	},

	async CommandNoteCreate(inputData) {
		let item = await WKCNoteAction.WKCNoteActionCreate(storageClient, {
			WKCNoteBody: typeof inputData === 'string' ? inputData : '',
		});

		WKCNotesAllStore.update(function (val) {
			return val.concat(item).sort(WKCWriteLogic.WKCWriteSort);
		});

		mod.CommandNoteSelect(item);

		if (!mod.DataIsMobile()) {
			return;
		}

		mod.WIKWriteDetailInstance.WIKWriteDetailFocus();
	},
	
	CommandNoteSelect(inputData) {
		mod._ValueNoteSelected = inputData;

		if (!inputData) {
			return;
		}

		if (mod.DataIsMobile()) {
			return;
		}
		
		mod.WIKWriteDetailInstance.WIKWriteDetailFocus();
	},
	
	async CommandNoteDiscard (inputData) {
		WKCNotesAllStore.update(function (val) {
			return val.filter(function(e) {
				return e !== inputData;
			});
		});

		await WKCNoteAction.WKCNoteActionDelete(storageClient, inputData.WKCNoteID);

		mod.CommandNoteSelect(null);
	},

	async CommandNotesExport () {
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

	async CommandNotesImport (inputData) {
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

WKCNotesAllStore.subscribe(mod.MessageNotesAllDidChange);

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
	<WKCWriteMaster
		WKCWriteMasterListItems={ mod._ValueNotesAll }
		WKCWriteMasterListItemSelected={ mod._ValueNoteSelected }
		WKCWriteMasterDispatchCreate={ mod.WKCWriteMasterDispatchCreate }
		WKCWriteMasterDispatchSelect={ mod.WKCWriteMasterDispatchSelect }
		WKCWriteMasterDelegateItemTitle={ mod.WKCWriteMasterDelegateItemTitle }
		OLSKMobileViewInactive={ mod._ValueNoteSelected }
		/>
	
	<WIKWriteDetail
		WIKWriteDetailItem={ mod._ValueNoteSelected }
		WIKWriteDetailDispatchBack={ mod.WIKWriteDetailDispatchBack }
		WIKWriteDetailDispatchDiscard={ mod.WIKWriteDetailDispatchDiscard }
		WIKWriteDetailDispatchUpdate={ mod.WIKWriteDetailDispatchUpdate }
		WIKWriteDetailDispatchOpen={ mod.WIKWriteDetailDispatchOpen }
		OLSKMobileViewInactive={ !mod._ValueNoteSelected }
		bind:this={ mod.WIKWriteDetailInstance }
		/>
</OLSKViewportContent>

<div id="WKCWriteStorageWidget" class="OLSKMobileViewFooter" class:WKCWriteStorageWidgetHidden={ mod._ValueStorageWidgetHidden }></div>

<WKCWriteFooter on:FooterDispatchExport={ mod.FooterDispatchExport } on:FooterDispatchImport={ mod.FooterDispatchImport } WKCWriteFooterStorageStatus={ mod._ValueFooterStorageStatus } WKCWriteFooterDispatchStorage={ mod.WKCWriteFooterDispatchStorage } />

</div>

{#if !OLSK_TESTING_BEHAVIOUR()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style src="./ui-style.css"></style>
