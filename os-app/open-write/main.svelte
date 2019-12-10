<script>
import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKThrottle from 'OLSKThrottle';
import * as WKCStorageClient from '../_shared/WKCStorageClient/main.js';
import { WKCStorageModule } from '../_shared/WKCStorageModule/main.js';
import { KVCNoteStorage } from '../_shared/KVCNote/storage.js';
import { KVCNoteModelPostJSONParse } from '../_shared/KVCNote/model.js';
import { KVCSettingStorage } from '../_shared/KVCSetting/storage.js';
import { KVCVersionStorage } from '../_shared/KVCVersion/storage.js';
import WKCParser from '../_shared/WKCParser/main.js';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
import * as KVCNoteAction from '../_shared/KVCNote/action.js';
import * as KVCNoteMetal from '../_shared/KVCNote/metal.js';
import * as KVCVersionAction from '../_shared/KVCVersion/action.js';
import * as KVCSettingAction from '../_shared/KVCSetting/action.js';
import * as KVCSettingMetal from '../_shared/KVCSetting/metal.js';
import * as WKCWriteLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueIsLoading: true,

	_ValueNotesAll: [],

	ValueNotesAll (inputData, shouldSort = true) {
		mod.ValueNotesVisible(mod._ValueNotesAll = inputData, shouldSort);
	},

	_ValueNotesVisible: [],

	ValueNotesVisible (inputData, shouldSort = true) {
		const items = !mod._ValueFilterText ? inputData : inputData.filter(function (e) {
			return e.KVCNoteBody.toLowerCase().match(mod._ValueFilterText.toLowerCase());
		});
		mod._ValueNotesVisible = shouldSort ? items.sort(WKCWriteLogic.WKCWriteLogicListSort) : items;
	},
	
	_ValueNoteSelected: undefined,

	ValueNoteSelected (inputData) {
		mod.WKCWriteDetailInstance.WKCWriteDetailSetItem(mod._ValueNoteSelected = inputData);

		if (!inputData) {
			mod.OLSKMobileViewInactive = false;	
		}
	},
	
	_ValueFilterText: '',
	
	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveNoteThrottleMap: {},

	_ValueSaveVersionThrottleMap: {},

	WKCWriteDetailInstance: undefined,

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
		mod.ValueNoteSelected(inputData);
	},

	WKCWriteMasterDispatchFilter (inputData) {
		mod.ControlFilter(inputData);
	},

	WKCWriteMasterDispatchExport () {
		mod.ControlNotesExportTXT();
	},

	WKCWriteMasterDelegateItemTitle (param1, param2) {
		return WKCWriteLogic.WKCWriteTruncatedTitleFor(WKCParser.WKCParserTitleForPlaintext(param1), param2);
	},

	WKCWriteMasterDelegateItemBody (inputData) {
		return WKCParser.WKCParserSnippetForPlaintext(WKCParser.WKCParserBodyForPlaintext(inputData));
	},

	WKCWriteDetailDispatchBack () {
		// mod.ControlNoteSelect(null);

		mod.OLSKMobileViewInactive = false;
	},

	WKCWriteDetailDispatchJump (inputData) {
		mod.ControlNoteJump(inputData);
	},

	WKCWriteDetailDispatchPublish () {
		mod.ControlNotePublish(mod._ValueNoteSelected);
	},

	WKCWriteDetailDispatchRetract () {
		mod.ControlNoteRetract(mod._ValueNoteSelected);
	},

	WKCWriteDetailDispatchVersions () {
		mod.ControlNoteVersions(mod._ValueNoteSelected);
	},

	WKCWriteDetailDispatchDiscard () {
		mod.ControlNoteDiscard(mod._ValueNoteSelected);
	},

	WKCWriteDetailDispatchUpdate (inputData) {
		mod._ValueNoteSelected.KVCNoteBody = inputData;
		
		mod.ControlNoteSave(mod._ValueNoteSelected);
	},

	WKCWriteDetailDispatchOpen (inputData) {
		mod.ControlFilter(inputData);
	},

	_WKCWriteFooterDispatchExport () {
		mod.ControlNotesExportData();
	},

	_WKCWriteFooterDispatchImport (inputData) {
		mod.ControlNotesImportData(inputData);
	},

	// INTERFACE	

	InterfaceWindowDidKeydown (event) {
		if (window.Launchlet.LCHSingletonExists()) {
			return;
		}

		const handlerFunctions = {
			Escape () {
				mod.ControlFilter('');

				if (!OLSK_TESTING_BEHAVIOUR()) {
					document.querySelector('.WKCWriteMasterBody').scrollTo(0, 0);
				}
			},
			Tab () {
				document.activeElement !== document.querySelector('.WKCWriteMasterFilterField') ? document.querySelector('.WKCWriteMasterFilterField').focus() : mod.WKCWriteDetailInstance.WKCWriteDetailEditorFocus();

				event.preventDefault();
			},
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	// CONTROL

	ControlNoteSave(inputData) {
		mod._ValueNotesAll

		OLSKThrottle.OLSKThrottleMappedTimeoutFor(mod._ValueSaveNoteThrottleMap, inputData.KVCNoteID, function (inputData) {
			return {
				OLSKThrottleDuration: 500,
				async OLSKThrottleCallback () {
					delete mod._ValueSaveNoteThrottleMap[inputData.KVCNoteID];

					await KVCNoteAction.KVCNoteActionUpdate(mod._ValueStorageClient, inputData);
				},
			};
		}, inputData);

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveNoteThrottleMap[inputData.KVCNoteID])	
		}

		OLSKThrottle.OLSKThrottleMappedTimeoutFor(mod._ValueSaveVersionThrottleMap, inputData.KVCNoteID, function (inputData) {
			return {
				OLSKThrottleDuration: 3000,
				OLSKThrottleCallback: async function () {
					delete mod._ValueSaveVersionThrottleMap[inputData.KVCNoteID];

					if (!inputData.KVCNoteCreationDate) {
						return;
					}

					await KVCVersionAction.KVCVersionActionCreate(mod._ValueStorageClient, {
						KVCVersionNoteID: inputData.KVCNoteID,
						KVCVersionBody: inputData.KVCNoteBody,
						KVCVersionDate: inputData.KVCNoteModificationDate,
					});
				},
			};
		}, inputData);


		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveVersionThrottleMap[inputData.KVCNoteID])	
		}
	},

	async ControlNoteCreate(inputData) {
		let item = await KVCNoteAction.KVCNoteActionCreate(mod._ValueStorageClient, {
			KVCNoteBody: typeof inputData === 'string' ? inputData : '',
		});

		mod.ValueNotesAll(mod._ValueNotesAll.concat(item));

		mod.ControlNoteSelect(item);

		if (mod.DataIsMobile()) {
			mod.WKCWriteDetailInstance.WKCWriteDetailEditorFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		mod.WKCWriteDetailInstance.WKCWriteDetailSetCursor(inputData.split('\n').length - 1, 0);
	},
	
	ControlNoteSelect(inputData) {
		mod.ValueNoteSelected(inputData);

		if (!inputData) {
			return !mod.DataIsMobile() && document.querySelector('.WKCWriteMasterFilterField').focus();
		}

		mod.OLSKMobileViewInactive = true;

		if (mod.DataIsMobile()) {
			return;
		}
		
		mod.WKCWriteDetailInstance.WKCWriteDetailEditorFocus();
	},
	
	ControlNoteJump (inputData) {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: inputData,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler () {
				if (mod.DataIsMobile()) {
					return;
				}

				mod.WKCWriteDetailInstance.WKCWriteDetailEditorFocus();
			},
		});
	},
	
	async ControlNotePublish (inputData) {
		mod.ValueNoteSelected(await KVCNoteAction.KVCNoteActionPublish(mod._ValueStorageClient, inputData));
	},
	
	async ControlNoteRetract (inputData) {
		mod.ValueNoteSelected(await KVCNoteAction.KVCNoteActionRetract(mod._ValueStorageClient, inputData));
	},
	
	async ControlNoteVersions (inputData) {
		(await KVCVersionAction.KVCVersionActionQuery(mod._ValueStorageClient, {
			KVCVersionNoteID: inputData.KVCNoteID,
		})).slice(0, 5).forEach(function (e) {
			console.log(e);
			console.log(e.KVCVersionBody);
		});
	},
	
	async ControlNoteDiscard (inputData) {
		mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
			return e !== inputData;
		}))

		await KVCNoteAction.KVCNoteActionDelete(mod._ValueStorageClient, inputData.KVCNoteID);

		mod.ControlNoteSelect(null);
	},
	
	ControlFilter(inputData) {
		mod._ValueFilterText = inputData;

		mod.ValueNotesVisible(mod._ValueNotesAll);

		if (!inputData) {
			return mod.ControlNoteSelect(null);
		}

		if (!mod._ValueNotesVisible.length) {
			return mod.ControlNoteSelect(null);
		}

		mod.ValueNoteSelected(mod._ValueNotesVisible.filter(function (e) {
			return WKCParser.WKCParserTitleForPlaintext(e.KVCNoteBody).toLowerCase() === inputData.toLowerCase();
		}).concat(mod._ValueNotesVisible.filter(function (e) {
			return WKCParser.WKCParserTitleForPlaintext(e.KVCNoteBody).toLowerCase().includes(inputData.toLowerCase());
		})).shift());
	},

	async ControlNotesExportData () {
		let zip = new JSZip();

		const fileName = [
			'com.wikiavec.export',
			(new Date()).toJSON(),
		].join(' ');

		zip.file(`${ fileName }.json`, JSON.stringify({
			KVCNoteObjects: mod._ValueNotesAll,
			KVCSettingObjects: await KVCSettingAction.KVCSettingsActionQuery(mod._ValueStorageClient, {}),
		}));
		
		zip.generateAsync({type: 'blob'}).then(function (content) {
			saveAs(content, `${ fileName }.zip`);
		});	
	},

	async ControlNotesImportData (inputData) {
		let outputData;
		try {
			outputData = JSON.parse(inputData);
		} catch (e)  {
			console.log(e);
		}

		if (typeof outputData !== 'object' || outputData === null) {
			return;
		}

		if (!Array.isArray(outputData.KVCNoteObjects)) {
			return;
		}

		if (!Array.isArray(outputData.KVCSettingObjects)) {
			return;
		}

		await Promise.all(outputData.KVCSettingObjects.map(function (e) {
			return KVCSettingMetal.KVCSettingsMetalWrite(mod._ValueStorageClient, e);
		}));

		await Promise.all(outputData.KVCNoteObjects.map(function (e) {
			return KVCNoteMetal.KVCNoteMetalWrite(mod._ValueStorageClient, KVCNoteModelPostJSONParse(e));
		}));

		mod.ValueNotesAll(await KVCNoteAction.KVCNoteActionQuery(mod._ValueStorageClient, {}));
	},

	ControlNotesExportTXT () {
		let zip = new JSZip();

		mod._ValueNotesAll.forEach(function (e) {
			zip.file(`${ e.KVCNoteID }.txt`, e.KVCNoteBody, {
				date: e.KVCNoteModificationDate,
			});
		});
		
		zip.generateAsync({type: 'blob'}).then(function (content) {
			saveAs(content, 'notes.zip');
		});
	},

	// REACT

	ReactIsLoading (inputData) {
		if (inputData) {
			return;
		}

		if (mod.DataIsMobile()) {
			return;
		}

		setTimeout(function () {
			document.querySelector('.WKCWriteMasterFilterField').focus();
		})
	},

	// SETUP

	SetupEverything () {
		mod.SetupStorageClient();

		mod.SetupStorageWidget();

		mod.SetupStorageStatus();
	},

	SetupStorageClient() {
		mod._ValueStorageClient = WKCStorageClient.WKCStorageClient({
			modules: [
				WKCStorageModule([
					KVCNoteStorage,
					KVCVersionStorage,
					KVCSettingStorage,
					].map(function (e) {
						return {
							WKCCollectionStorageGenerator: e,
							WKCCollectionChangeDelegate: e === KVCNoteStorage ? {
								OLSKChangeDelegateCreate (inputData) {
									// console.log('OLSKChangeDelegateCreate', inputData);

									mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
										return e.KVCNoteID !== inputData.KVCNoteID; // @Hotfix Dropbox sending DelegateAdd
									}).concat(inputData));
								},
								OLSKChangeDelegateUpdate (inputData) {
									// console.log('OLSKChangeDelegateUpdate', inputData);

									if (mod._ValueNoteSelected && (mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID)) {
										mod.ControlNoteSelect(Object.assign(mod._ValueNoteSelected, inputData));
									}

									mod.ValueNotesAll(mod._ValueNotesAll.map(function (e) {
										return Object.assign(e, e.KVCNoteID === inputData.KVCNoteID ? inputData : {});
									}), false);
								},
								OLSKChangeDelegateDelete (inputData) {
									// console.log('OLSKChangeDelegateDelete', inputData);

									if (mod._ValueNoteSelected && (mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID)) {
										mod.ControlNoteSelect(null);
									}

									mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
										return e.KVCNoteID !== inputData.KVCNoteID;
									}), false);
								},
							} : null,
						}
					})),
			],
		});

		mod._ValueStorageClient.remoteStorage.on('ready', async () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('ready', arguments);
			}

			await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_notes.KVCNoteStorageCache();
			await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_settings.KVCSettingStorageCache();
			await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_versions.KVCVersionStorageCache();

			mod.ValueNotesAll(await KVCNoteAction.KVCNoteActionQuery(mod._ValueStorageClient, {}));

			mod.ReactIsLoading(mod._ValueIsLoading = false);
		});

		mod._ValueStorageClient.remoteStorage.on('not-connected', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('not-connected', arguments);
			}
		});

		mod._ValueStorageClient.remoteStorage.on('disconnected', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('disconnected', arguments);
			}
		});

		mod._ValueStorageClient.remoteStorage.on('connected', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('connected', arguments);
			}
		});

		mod._ValueStorageClient.remoteStorage.on('sync-done', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('sync-done', arguments);
			}
		});

		let isOffline;

		mod._ValueStorageClient.remoteStorage.on('network-offline', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('network-offline', arguments);
			}

			isOffline = true;
		});

		mod._ValueStorageClient.remoteStorage.on('network-online', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('network-online', arguments);
			}
			
			isOffline = false;
		});

		mod._ValueStorageClient.remoteStorage.on('error', (error) => {
			if (isOffline && inputData.message === 'Sync failed: Network request failed.') {
				return;
			};

			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('error', error);
			}
		});
	},

	SetupStorageWidget () {
		(new window.OLSKStorageWidget(mod._ValueStorageClient.remoteStorage)).attach('WKCWriteStorageWidget').backend(document.querySelector('.WKCWriteFooterStorageButton'));
	},

	SetupStorageStatus () {
		OLSKRemoteStorage.OLSKRemoteStorageStatus(mod._ValueStorageClient.remoteStorage, function (inputData) {
			mod._ValueFooterStorageStatus = inputData;
		}, OLSKLocalized)
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

import OLSKViewportContent from 'OLSKViewportContent';
import WKCWriteMaster from './submodules/WKCWriteMaster/main.svelte';
import WKCWriteDetail from './submodules/WKCWriteDetail/main.svelte';
import WKCWriteFooter from './submodules/WKCWriteFooter/main.svelte';
import OLSKServiceWorker from '../_shared/__external/OLSKServiceWorker/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="WKCWrite OLSKViewport" class:OLSKIsLoading={ mod._ValueIsLoading }>

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
		WKCWriteMasterDelegateItemBody={ mod.WKCWriteMasterDelegateItemBody }
		OLSKMobileViewInactive={ mod.OLSKMobileViewInactive }
		/>
	
	<WKCWriteDetail
		WKCWriteDetailDispatchBack={ mod.WKCWriteDetailDispatchBack }
		WKCWriteDetailDispatchJump={ mod.WKCWriteDetailDispatchJump }
		WKCWriteDetailDispatchPublish={ mod.WKCWriteDetailDispatchPublish }
		WKCWriteDetailDispatchRetract={ mod.WKCWriteDetailDispatchRetract }
		WKCWriteDetailDispatchVersions={ mod.WKCWriteDetailDispatchVersions }
		WKCWriteDetailDispatchDiscard={ mod.WKCWriteDetailDispatchDiscard }
		WKCWriteDetailDispatchUpdate={ mod.WKCWriteDetailDispatchUpdate }
		WKCWriteDetailDispatchOpen={ mod.WKCWriteDetailDispatchOpen }
		OLSKMobileViewInactive={ !mod.OLSKMobileViewInactive }
		bind:this={ mod.WKCWriteDetailInstance }
		/>
</OLSKViewportContent>

<div id="WKCWriteStorageWidget" class="OLSKMobileViewFooter" class:WKCWriteStorageWidgetHidden={ mod._ValueStorageWidgetHidden }></div>

<WKCWriteFooter
	WKCWriteFooterStorageStatus={ mod._ValueFooterStorageStatus }
	WKCWriteFooterDispatchStorage={ mod.WKCWriteFooterDispatchStorage }
	_WKCWriteFooterDispatchExport={ mod._WKCWriteFooterDispatchExport }
	_WKCWriteFooterDispatchImport={ mod._WKCWriteFooterDispatchImport }
	/>

</div>

{#if !OLSK_TESTING_BEHAVIOUR()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style src="./ui-style.css"></style>
