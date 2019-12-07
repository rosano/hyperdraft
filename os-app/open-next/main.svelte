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

	_ValueNotesVisible: [],

	ValueNotesVisible(inputData) {
		mod._ValueNotesVisible = (!mod._ValueFilterText ? inputData : inputData.filter(function (e) {
			return e.WKCNoteBody.toLowerCase().match(mod._ValueFilterText.toLowerCase());
		})).sort(WKCWriteLogic.WKCWriteSort);
	},
	
	_ValueNoteSelected: undefined,
	
	_ValueFilterText: '',
	
	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveThrottleMap: {},

	WIKWriteDetailInstance: undefined,

	OLSKMobileViewInactive: false,

	// DATA

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	// MESSAGE

	WKCWriteFooterDispatchStorage () {
		mod._ValueStorageWidgetHidden = !mod._ValueStorageWidgetHidden;
	},

	WKCWriteMasterDispatchCreate (inputData) {
		mod.ControlNoteCreate(inputData);
	},

	WKCWriteMasterDispatchClick (inputData) {
		mod.ControlNoteSelect(inputData);
	},

	WKCWriteMasterDispatchArrow (inputData) {
		mod._ValueNoteSelected = inputData;
	},

	WKCWriteMasterDispatchFilter (inputData) {
		mod.ControlFilter(inputData);
	},

	WKCWriteMasterDispatchExport () {
		mod.ControlNotesExportTXT();
	},

	WKCWriteMasterDelegateItemTitle (inputData) {
		return WKCParser.WKCParserTitleForPlaintext(inputData.WKCNoteBody);
	},

	WIKWriteDetailDispatchBack () {
		mod.ControlNoteSelect(null);
	},

	WIKWriteDetailDispatchDiscard (inputData) {
		mod.ControlNoteDiscard(inputData);
	},

	WIKWriteDetailDispatchUpdate (inputData) {
		mod._ValueNoteSelected.WKCNoteBody = inputData;
		
		mod.ControlNoteSave();
	},

	WIKWriteDetailDispatchOpen () {},

	MessageNotesAllDidChange(inputData) {
		mod.ValueNotesVisible(inputData);
	},

	FooterDispatchExport () {
		ControlNotesExport();
	},

	FooterDispatchImport (event) {
		ControlNotesImport(event.detail);
	},

	// CONTROL

	ControlNoteSave() {
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

	async ControlNoteCreate(inputData) {
		let item = await WKCNoteAction.WKCNoteActionCreate(storageClient, {
			WKCNoteBody: typeof inputData === 'string' ? inputData : '',
		});

		WKCNotesAllStore.update(function (val) {
			return val.concat(item).sort(WKCWriteLogic.WKCWriteSort);
		});

		mod.ControlNoteSelect(item);

		if (mod.DataIsMobile()) {
			mod.WIKWriteDetailInstance.WIKWriteDetailFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		mod.WIKWriteDetailInstance.WIKWriteDetailSetCursor(inputData.split('\n').length - 1, 0);
	},
	
	ControlNoteSelect(inputData) {
		mod._ValueNoteSelected = inputData;

		if (!inputData && !OLSK_TESTING_BEHAVIOUR()) {
			document.querySelector('.WKCWriteMasterBody').scrollTo(0, 0);
		};

		if (!inputData) {
			mod.OLSKMobileViewInactive = false;

			return document.querySelector('.WKCWriteMasterFilterField').focus();
		}

		mod.OLSKMobileViewInactive = true;

		if (mod.DataIsMobile()) {
			return;
		}
		
		mod.WIKWriteDetailInstance.WIKWriteDetailFocus();
	},
	
	async ControlNoteDiscard (inputData) {
		WKCNotesAllStore.update(function (val) {
			return val.filter(function(e) {
				return e !== inputData;
			});
		});

		await WKCNoteAction.WKCNoteActionDelete(storageClient, inputData.WKCNoteID);

		mod.ControlNoteSelect(null);
	},
	
	ControlFilter(inputData) {
		mod._ValueFilterText = inputData;

		mod.ValueNotesVisible($WKCNotesAllStore);

		if (!inputData) {
			return mod.ControlNoteSelect(null);
		}

		if (!mod._ValueNotesVisible.length) {
			return mod.ControlNoteSelect(null);
		}

		mod._ValueNoteSelected = mod._ValueNotesVisible.filter(function (e) {
			return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase() === inputData.toLowerCase();
		}).concat(mod._ValueNotesVisible.filter(function (e) {
			return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase().includes(inputData.toLowerCase());
		})).shift();
	},

	async ControlNotesExport () {
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

	async ControlNotesImport (inputData) {
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

	ControlNotesExportTXT () {
		let zip = new JSZip();

		$WKCNotesAllStore.forEach(function (e) {
			zip.file(`${ e.WKCNoteID }.txt`, e.WKCNoteBody, {
				date: e.WKCNoteModificationDate,
			});
		});
		
		zip.generateAsync({type: 'blob'}).then(function (content) {
			saveAs(content, 'notes.zip');
		});
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
		WKCWriteMasterListItems={ mod._ValueNotesVisible }
		WKCWriteMasterListItemSelected={ mod._ValueNoteSelected }
		WKCWriteMasterFilterText={ mod._ValueFilterText }
		WKCWriteMasterDispatchCreate={ mod.WKCWriteMasterDispatchCreate }
		WKCWriteMasterDispatchClick={ mod.WKCWriteMasterDispatchClick }
		WKCWriteMasterDispatchArrow={ mod.WKCWriteMasterDispatchArrow }
		WKCWriteMasterDispatchFilter={ mod.WKCWriteMasterDispatchFilter }
		WKCWriteMasterDispatchExport={ mod.WKCWriteMasterDispatchExport }
		WKCWriteMasterDelegateItemTitle={ mod.WKCWriteMasterDelegateItemTitle }
		OLSKMobileViewInactive={ mod.OLSKMobileViewInactive }
		/>
	
	<WIKWriteDetail
		WIKWriteDetailItem={ mod._ValueNoteSelected }
		WIKWriteDetailDispatchBack={ mod.WIKWriteDetailDispatchBack }
		WIKWriteDetailDispatchDiscard={ mod.WIKWriteDetailDispatchDiscard }
		WIKWriteDetailDispatchUpdate={ mod.WIKWriteDetailDispatchUpdate }
		WIKWriteDetailDispatchOpen={ mod.WIKWriteDetailDispatchOpen }
		OLSKMobileViewInactive={ !mod.OLSKMobileViewInactive }
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
