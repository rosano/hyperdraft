<script>
import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKThrottle from 'OLSKThrottle';
import * as KVCStorageClient from '../_shared/KVCStorageClient/main.js';
import { KVCStorageModule } from '../_shared/KVCStorageModule/main.js';
import { KVCNoteStorage } from '../_shared/KVCNote/storage.js';
import { KVCNoteModelPostJSONParse } from '../_shared/KVCNote/model.js';
import { KVCSettingStorage } from '../_shared/KVCSetting/storage.js';
import { KVCVersionStorage } from '../_shared/KVCVersion/storage.js';
import KVCParser from '../_shared/KVCParser/main.js';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import * as OLSKRemoteStorage from '../_shared/__external/OLSKRemoteStorage/main.js'
import * as KVCNoteAction from '../_shared/KVCNote/action.js';
import * as KVCNoteMetal from '../_shared/KVCNote/metal.js';
import * as KVCVersionAction from '../_shared/KVCVersion/action.js';
import * as KVCSettingAction from '../_shared/KVCSetting/action.js';
import * as KVCSettingMetal from '../_shared/KVCSetting/metal.js';
import * as KVCWriteLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueIsLoading: true,

	_ValueNotesAll: [],
	ValueNotesAll (inputData, shouldSort = true) {
		mod.ValueNotesVisible(mod._ValueNotesAll = inputData, shouldSort);
	},

	_ValueNotesVisible: [],
	ValueNotesVisible (inputData, shouldSort = true) {
		const items = !mod._ValueFilterText ? inputData : inputData.filter(KVCWriteLogic.KVCWriteFilterFunction(mod._ValueFilterText));
		mod._ValueNotesVisible = shouldSort ? items.sort(KVCWriteLogic.KVCWriteLogicListSort) : items;
	},
	
	_ValueNoteSelected: undefined,
	ValueNoteSelected (inputData) {
		mod.KVCWriteDetailInstance.KVCWriteDetailSetItem(mod._ValueNoteSelected = inputData);

		if (!inputData) {
			mod.OLSKMobileViewInactive = false;	
		}
	},
	
	_ValueFilterText: '',
	
	_ValueStorageWidgetHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveNoteThrottleMap: {},

	_ValueSaveVersionThrottleMap: {},

	KVCWriteDetailInstance: undefined,

	OLSKMobileViewInactive: false,

	// DATA

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	DataVersionsIsDisabled () {
		return false;
		return !OLSK_TESTING_BEHAVIOUR();
	},

	DataDebugPersistenceIsEnabled () {
		return !OLSK_TESTING_BEHAVIOUR();
	},

	// MESSAGE

	OLSKAppToolbarDispatchStorage () {
		mod._ValueStorageWidgetHidden = !mod._ValueStorageWidgetHidden;
	},

	KVCWriteMasterDispatchCreate (inputData) {
		mod.ControlNoteCreate(inputData);
	},

	KVCWriteMasterDispatchClick (inputData) {
		mod.ControlNoteSelect(inputData);
	},

	KVCWriteMasterDispatchArrow (inputData) {
		mod.ValueNoteSelected(inputData);
	},

	KVCWriteMasterDispatchFilter (inputData) {
		mod.ControlFilter(inputData);
	},

	KVCWriteMasterDispatchExport () {
		mod.ControlNotesExportTXT();
	},

	KVCWriteMasterDelegateItemTitle (param1, param2) {
		return KVCWriteLogic.KVCWriteTruncatedTitleFor(KVCParser.KVCParserTitleForPlaintext(param1), param2);
	},

	KVCWriteMasterDelegateItemBody (inputData) {
		return KVCParser.KVCParserSnippetForPlaintext(KVCParser.KVCParserBodyForPlaintext(inputData));
	},

	KVCWriteDetailDispatchBack () {
		// mod.ControlNoteSelect(null);

		mod.OLSKMobileViewInactive = false;
	},

	KVCWriteDetailDispatchJump (inputData) {
		mod.ControlNoteJump(inputData);
	},

	KVCWriteDetailDispatchPublish () {
		mod.ControlNotePublish(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchRetract () {
		mod.ControlNoteRetract(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchVersions () {
		mod.ControlNoteVersions(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchDiscard () {
		mod.ControlNoteDiscard(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchUpdate () {
		mod._ValueNoteSelected = mod._ValueNoteSelected; // #purge-svelte-force-update
		
		mod.ControlNoteSave(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchOpen (inputData) {
		mod.ControlFilter(inputData);
	},

	_OLSKAppToolbarDispatchExport () {
		mod.ControlNotesExportData();
	},

	_OLSKAppToolbarDispatchImport (inputData) {
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
					document.querySelector('.KVCWriteMasterBody').scrollTo(0, 0);
				}
			},
			Tab () {
				document.activeElement !== document.querySelector('.KVCWriteMasterFilterField') ? document.querySelector('.KVCWriteMasterFilterField').focus() : mod.KVCWriteDetailInstance.KVCWriteDetailEditorFocus();

				event.preventDefault();
			},
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	// CONTROL

	ControlNoteSave(inputData) {
		if (mod.DataDebugPersistenceIsEnabled()) {
			console.info('ControlNoteSave', inputData.KVCNoteID, inputData.KVCNoteBody);
		}

		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveNoteThrottleMap, inputData.KVCNoteID, {
			OLSKThrottleDuration: 500,
			async OLSKThrottleCallback () {
				if (mod.DataDebugPersistenceIsEnabled()) {
					console.info('OLSKThrottleCallback', inputData.KVCNoteID, inputData.KVCNoteBody);
				}

				await KVCNoteAction.KVCNoteActionUpdate(mod._ValueStorageClient, inputData);
			},
		});

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveNoteThrottleMap[inputData.KVCNoteID])	
		}

		if (mod.DataVersionsIsDisabled()) {
			return;
		}

		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveVersionThrottleMap, inputData.KVCNoteID, {
			OLSKThrottleDuration: 3000,
			async OLSKThrottleCallback () {
				if (!inputData.KVCNoteCreationDate) {
					return;
				}

				await KVCVersionAction.KVCVersionActionCreate(mod._ValueStorageClient, {
					KVCVersionNoteID: inputData.KVCNoteID,
					KVCVersionBody: inputData.KVCNoteBody,
					KVCVersionDate: inputData.KVCNoteModificationDate,
				});
			},
		});

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveVersionThrottleMap[inputData.KVCNoteID])	
		}
	},

	async ControlNoteCreate(inputData) {
		const item = await KVCNoteAction.KVCNoteActionCreate(mod._ValueStorageClient, {
			KVCNoteBody: typeof inputData === 'string' ? inputData : '',
		});

		mod.ValueNotesAll(mod._ValueNotesAll.concat(item));

		mod.ControlNoteSelect(item);

		if (mod.DataIsMobile()) {
			mod.KVCWriteDetailInstance.KVCWriteDetailEditorFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		mod.KVCWriteDetailInstance.KVCWriteDetailSetCursor(inputData.split('\n').length - 1, 0);
	},
	
	ControlNoteSelect(inputData) {
		mod.ValueNoteSelected(inputData);

		if (!inputData) {
			return !mod.DataIsMobile() && document.querySelector('.KVCWriteMasterFilterField').focus();
		}

		mod.OLSKMobileViewInactive = true;

		if (mod.DataIsMobile()) {
			return;
		}
		
		mod.KVCWriteDetailInstance.KVCWriteDetailEditorFocus();
	},
	
	ControlNoteJump (inputData) {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: inputData,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler () {
				if (mod.DataIsMobile()) {
					return;
				}

				mod.KVCWriteDetailInstance.KVCWriteDetailEditorFocus();
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

		mod.ControlNoteSelect(null);

		await KVCNoteAction.KVCNoteActionDelete(mod._ValueStorageClient, inputData.KVCNoteID);
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
			return KVCParser.KVCParserTitleForPlaintext(e.KVCNoteBody).toLowerCase() === inputData.toLowerCase();
		}).concat(mod._ValueNotesVisible.filter(function (e) {
			return KVCParser.KVCParserTitleForPlaintext(e.KVCNoteBody).toLowerCase().includes(inputData.toLowerCase());
		})).shift());
	},

	async ControlNotesExportData () {
		const zip = new JSZip();

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
		const zip = new JSZip();

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
			document.querySelector('.KVCWriteMasterFilterField').focus();
		})
	},

	// SETUP

	async SetupEverything () {
		mod.SetupStorageClient();

		mod.SetupStorageWidget();

		mod.SetupStorageStatus();

		await mod.SetupStorageNotifications();

		await mod.SetupDataCache();

		await mod.SetupValueNotesAll();

		mod.ReactIsLoading(mod._ValueIsLoading = false);
	},

	SetupStorageClient() {
		mod._ValueStorageClient = KVCStorageClient.KVCStorageClient({
			modules: [
				KVCStorageModule([
					KVCNoteStorage,
					KVCVersionStorage,
					KVCSettingStorage,
					].map(function (e) {
						return {
							KVCCollectionStorageGenerator: e,
							KVCCollectionChangeDelegate: e === KVCNoteStorage ? {
								OLSKChangeDelegateCreate (inputData) {
									// console.log('OLSKChangeDelegateCreate', inputData);

									mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
										return e.KVCNoteID !== inputData.KVCNoteID; // @Hotfix Dropbox sending DelegateAdd
									}).concat(inputData));
								},
								OLSKChangeDelegateUpdate (inputData) {
									// console.log('OLSKChangeDelegateUpdate', inputData);

									if (mod.DataDebugPersistenceIsEnabled()) {
										console.log('OLSKChangeDelegateUpdate', inputData.KVCNoteID, inputData.KVCNoteBody);
									}

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
	},

	SetupStorageWidget () {
		(new window.OLSKStorageWidget(mod._ValueStorageClient.remoteStorage)).attach('KVCWriteStorageWidget').backend(document.querySelector('.OLSKAppToolbarStorageButton'));
	},

	SetupStorageStatus () {
		OLSKRemoteStorage.OLSKRemoteStorageStatus(mod._ValueStorageClient.remoteStorage, function (inputData) {
			mod._ValueFooterStorageStatus = inputData;
		}, OLSKLocalized)
	},

	async SetupStorageNotifications () {
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

		return new Promise(function (res, rej) {
			mod._ValueStorageClient.remoteStorage.on('ready', () => {
				if (!OLSK_TESTING_BEHAVIOUR()) {
					console.debug('ready', arguments);
				}

				res();
			});
		})
	},

	async SetupDataCache() {
		await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_notes.KVCNoteStorageCache();
		await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_settings.KVCSettingStorageCache();
		await mod._ValueStorageClient.remoteStorage.wikiavec.kvc_versions.KVCVersionStorageCache();
	},

	async SetupValueNotesAll() {
		mod.ValueNotesAll((await KVCNoteAction.KVCNoteActionQuery(mod._ValueStorageClient, {})).filter(function (e) {
			return typeof e === 'object'; // #patch-remotestorage-true
		}));
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

import OLSKViewportContent from 'OLSKViewportContent';
import KVCWriteMaster from './submodules/KVCWriteMaster/main.svelte';
import KVCWriteDetail from './submodules/KVCWriteDetail/main.svelte';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKServiceWorker from '../_shared/__external/OLSKServiceWorker/main.svelte';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="KVCWrite OLSKViewport" class:OLSKIsLoading={ mod._ValueIsLoading }>

<OLSKViewportContent>
	<KVCWriteMaster
		KVCWriteMasterListItems={ mod._ValueNotesVisible }
		KVCWriteMasterListItemSelected={ mod._ValueNoteSelected }
		KVCWriteMasterFilterText={ mod._ValueFilterText }
		KVCWriteMasterDispatchCreate={ mod.KVCWriteMasterDispatchCreate }
		KVCWriteMasterDispatchClick={ mod.KVCWriteMasterDispatchClick }
		KVCWriteMasterDispatchArrow={ mod.KVCWriteMasterDispatchArrow }
		KVCWriteMasterDispatchFilter={ mod.KVCWriteMasterDispatchFilter }
		KVCWriteMasterDispatchExport={ mod.KVCWriteMasterDispatchExport }
		KVCWriteMasterDelegateItemTitle={ mod.KVCWriteMasterDelegateItemTitle }
		KVCWriteMasterDelegateItemBody={ mod.KVCWriteMasterDelegateItemBody }
		OLSKMobileViewInactive={ mod.OLSKMobileViewInactive }
		/>
	
	<KVCWriteDetail
		KVCWriteDetailDispatchBack={ mod.KVCWriteDetailDispatchBack }
		KVCWriteDetailDispatchJump={ mod.KVCWriteDetailDispatchJump }
		KVCWriteDetailDispatchPublish={ mod.KVCWriteDetailDispatchPublish }
		KVCWriteDetailDispatchRetract={ mod.KVCWriteDetailDispatchRetract }
		KVCWriteDetailDispatchVersions={ mod.KVCWriteDetailDispatchVersions }
		KVCWriteDetailDispatchDiscard={ mod.KVCWriteDetailDispatchDiscard }
		KVCWriteDetailDispatchUpdate={ mod.KVCWriteDetailDispatchUpdate }
		KVCWriteDetailDispatchOpen={ mod.KVCWriteDetailDispatchOpen }
		OLSKMobileViewInactive={ !mod.OLSKMobileViewInactive }
		_KVCWriteDetailVersionsIsDisabled={ mod.DataVersionsIsDisabled() }
		bind:this={ mod.KVCWriteDetailInstance }
		/>
</OLSKViewportContent>

<footer class="KVCWriteViewportFooter OLSKMobileViewFooter">
	<div id="KVCWriteStorageWidget" class:KVCWriteStorageWidgetHidden={ mod._ValueStorageWidgetHidden }></div>

	<OLSKAppToolbar
		OLSKAppToolbarDonateURL={ window.OLSKPublicConstants('KVC_SHARED_DONATE_URL') }
		OLSKAppToolbarStorageStatus={ mod._ValueFooterStorageStatus }
		OLSKAppToolbarDispatchStorage={ mod.OLSKAppToolbarDispatchStorage }
		_OLSKAppToolbarDispatchExport={ mod._OLSKAppToolbarDispatchExport }
		_OLSKAppToolbarDispatchImport={ mod._OLSKAppToolbarDispatchImport }
		/>
</footer>

</div>

{#if !OLSK_TESTING_BEHAVIOUR()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style src="./ui-style.css"></style>
