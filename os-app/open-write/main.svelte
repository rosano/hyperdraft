<script>
import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

import OLSKThrottle from 'OLSKThrottle';
import KVC_Data from '../_shared/KVC_Data/main.js';
import KVCNoteStorage from '../_shared/KVCNote/storage.js';
import KVCNoteModel from '../_shared/KVCNote/model.js';
import KVCSettingStorage from '../_shared/KVCSetting/storage.js';
import KVCVersionStorage from '../_shared/KVCVersion/storage.js';
import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import * as OLSKRemoteStoragePackage from '../_shared/__external/OLSKRemoteStorage/main.js'
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;
import * as OLSKServiceWorkerPackage from '../_shared/__external/OLSKServiceWorker/main.js'
const OLSKServiceWorker = OLSKServiceWorkerPackage.default || OLSKServiceWorkerPackage;
import KVCNoteAction from '../_shared/KVCNote/action.js';
import KVCVersionAction from '../_shared/KVCVersion/action.js';
import KVCSettingAction from '../_shared/KVCSetting/action.js';
import KVCWriteLogic from './ui-logic.js';
import * as RemoteStoragePackage from 'remotestoragejs';
const RemoteStorage = RemoteStoragePackage.default || RemoteStoragePackage;
import KVCTemplate from '../_shared/KVCTemplate/main.js';
import * as showdownPackage from 'showdown';
const showdown = showdownPackage.default || showdownPackage;

const mod = {

	// VALUE

	_ValueIsLoading: true,

	_RevealArchiveIsVisible: false,
	_ValueArchivedCount: 0,
	ValueArchivedCount (inputData) {
		mod._ValueArchivedCount = inputData.filter(function (e) {
			return e.KVCNoteIsArchived;
		}).length;
	},

	_ValueNotesAll: [],
	ValueNotesAll (inputData, shouldSort = true) {
		mod.ValueNotesVisible(mod._ValueNotesAll = inputData, shouldSort);
	},

	_ValueNotesVisible: [],
	ValueNotesVisible (inputData, shouldSort = true) {
		let items = !mod._ValueFilterText ? inputData : inputData.filter(KVCWriteLogic.KVCWriteFilterFunction(mod._ValueFilterText));

		if (mod.DataRevealArchiveIsVisible()) {
			items = items.filter(function (e) {
				return !e.KVCNoteIsArchived;
			});
		}

		mod._ValueNotesVisible = shouldSort ? items.sort(KVCWriteLogic.KVCWriteLogicListSort) : items;
	},
	
	_ValueNoteSelected: undefined,
	ValueNoteSelected (inputData) {
		mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailSetItem(mod._ValueNoteSelected = inputData);

		if (!inputData) {
			mod.OLSKMobileViewInactive = false;	
		}
	},
	
	_ValueFilterText: '',
	
	_ValueStorageToolbarHidden: true,

	_ValueFooterStorageStatus: '',

	_ValueSaveNoteThrottleMap: {},

	_ValueSaveVersionThrottleMap: {},
	
	_ValueSavePublishThrottleMap: {},

	KVCWriteDetailInstance: undefined,

	OLSKMobileViewInactive: false,

	_ValueDidMigrate: false,

	_ValueStorageIsConnected: false,

	_ValueSettingsAll: [],
	
	// DATA

	DataSetting (inputData) {
		return mod._ValueSettingsAll.filter(function (e) {
			return e.KVCSettingKey === inputData;
		}).shift();
	},
	
	DataSettingValue (inputData) {
		return (mod.DataSetting(inputData) || {}).KVCSettingValue;
	},

	DataNavigator () {
		return navigator.serviceWorker ? navigator : {
			serviceWorker: {},
		};
	},

	DataRecipes () {
		const outputData = [{
			LCHRecipeSignature: 'KVCWriteLauncherItemJournal',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemJournalText'),
			LCHRecipeCallback: function KVCWriteLauncherItemJournal () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemJournalTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_TESTING_BEHAVIOUR() ? '2001-02-03T04:05:06Z' : Date.now())), OLSKLocalized));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemBacklinks',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemBacklinksText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemBacklinks () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemBacklinksTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_TESTING_BEHAVIOUR() ? '2001-02-03T04:05:06Z' : Date.now())), KVCWriteLogic.KVCWriteBacklinksMap(mod._ValueNotesAll), OLSKLocalized));
			},
		}];

		if (mod._ValueStorageIsConnected) {
			let count = 0;
			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemConfigureCustomDomain',
				LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainText'),
				LCHRecipeCallback: function KVCWriteLauncherItemConfigureCustomDomain () {
					const prompt1 = !OLSK_TESTING_BEHAVIOUR() || (OLSK_TESTING_BEHAVIOUR() && !count);
					const prompt2 = !OLSK_TESTING_BEHAVIOUR() || (OLSK_TESTING_BEHAVIOUR() && count);
					const confirm3 = !OLSK_TESTING_BEHAVIOUR() || (OLSK_TESTING_BEHAVIOUR() && count == 2);

					if (prompt1) {
						if (window.prompt(OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt1QuestionText'), KVCNoteStorage.KVCNoteStoragePublicURL(mod._ValueStorageClient, KVCNoteStorage.KVCNoteStoragePublicRootPagePath())) === null) {
							return;
						};
					}
					
					if (prompt2) {
						const callback = async function () {
							const response = OLSK_TESTING_BEHAVIOUR() && confirm3 ? '' : window.prompt(OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt2QuestionText'));

							if (response === null) {
								return;
							}

							if (!response && window.confirm(OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainConfirmQuestionText'))) {
								callback();
							}

							if (!response) {
								return;
							}

							const item = KVCWriteLogic.KVCWriteCustomDomainBaseURLData(response);
							if (item) {
								await mod.ControlSettingStore('KVCSettingCustomDomainBaseURL', item);
								
								if (mod._ValueNoteSelected) {
									await mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);
								}

								return 
							}
						};

						callback();
					}

					if (OLSK_TESTING_BEHAVIOUR()) {
						count += 1;
					}
				},
			});

			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemRemoveCustomDomain',
				LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemRemoveCustomDomainText'),
				LCHRecipeCallback: async function KVCWriteLauncherItemRemoveCustomDomain () {
					await KVCSettingAction.KVCSettingsActionDelete(mod._ValueStorageClient, 'KVCSettingCustomDomainBaseURL');

					delete mod._ValueSettingsAll[mod._ValueSettingsAll.indexOf(mod.DataSetting('KVCSettingCustomDomainBaseURL'))];

					if (mod._ValueNoteSelected) {
						mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);
					}
				},
				LCHRecipeIsExcluded () {
					return !mod.DataSetting('KVCSettingCustomDomainBaseURL');
				},
			});
		}

		if (OLSK_TESTING_BEHAVIOUR()) {
			outputData.push(...[
				{
					LCHRecipeName: 'FakeOLSKChangeDelegateCreateNote',
					LCHRecipeCallback: async function FakeOLSKChangeDelegateCreateNote () {
						return mod.OLSKChangeDelegateCreateNote(await KVCNoteAction.KVCNoteActionCreate(mod._ValueStorageClient, mod.FakeNoteObjectValid('FakeOLSKChangeDelegateCreateNote')));
					},
				},
				{
					LCHRecipeName: 'FakeOLSKChangeDelegateUpdateNote',
					LCHRecipeCallback: async function FakeOLSKChangeDelegateUpdateNote () {
						return mod.OLSKChangeDelegateUpdateNote(await KVCNoteAction.KVCNoteActionUpdate(mod._ValueStorageClient, Object.assign(mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeOLSKChangeDelegate');
						}).pop(), {
							KVCNoteBody: 'FakeOLSKChangeDelegateUpdateNote',
						})));
					},
				},
				{
					LCHRecipeName: 'FakeOLSKChangeDelegateDeleteNote',
					LCHRecipeCallback: async function FakeOLSKChangeDelegateDeleteNote () {
						const item = mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeOLSKChangeDelegate');
						}).pop();
						
						await KVCNoteAction.KVCNoteActionDelete(mod._ValueStorageClient, item);
						
						return mod.OLSKChangeDelegateDeleteNote(item);
					},
				},
				{
					LCHRecipeName: 'FakeOLSKChangeDelegateConflictNote',
					LCHRecipeCallback: async function FakeOLSKChangeDelegateConflictNote () {
						const item = mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeOLSKChangeDelegateConflictNote');
						}).pop();
						
						return mod.OLSKChangeDelegateConflictNote({
							origin: 'conflict',
							oldValue: OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(await KVCNoteAction.KVCNoteActionUpdate(mod._ValueStorageClient, Object.assign({}, item, {
								KVCNoteBody: item.KVCNoteBody + '-local',
							}))),
							newValue: OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(Object.assign({}, item, {
								KVCNoteBody: item.KVCNoteBody + '-remote',
							})),
						});
					},
				},
				{
					LCHRecipeName: 'FakeEscapeWithoutSort',
					LCHRecipeCallback: function FakeEscapeWithoutSort () {
						mod.ControlNoteSelect(null);
					},
				},
				{
					LCHRecipeName: 'FakeCreateNoteV1',
					LCHRecipeCallback: async function FakeCreateNoteV1 () {
						const item = {
							KVCNoteID: 'alfa',
							KVCNoteBody: '',
							KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
							KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
						};
						await OLSKRemoteStorage.OLSKRemoteStorageWriteObject(mod._ValueStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePrivateClient(), KVCNoteStorage.KVCNoteStorageObjectPathV1(item), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(item));
						await mod.SetupValueNotesAll();
					},
				},
				{
					LCHRecipeName: 'FakeStorageNotConnected',
					LCHRecipeCallback: function FakeStorageNotConnected () {
						mod.StorageNotConnected();
					},
				},
				{
					LCHRecipeName: 'FakeStorageSyncDone',
					LCHRecipeCallback: function FakeStorageSyncDone () {
						mod.StorageSyncDone();
					},
				},
				{
					LCHRecipeName: 'FakeStorageIsConnected',
					LCHRecipeCallback: function FakeStorageIsConnected () {
						mod._ValueStorageIsConnected = true;
					},
				},
				{
					LCHRecipeName: 'FakeConfigureCustomDomain',
					LCHRecipeCallback: async function FakeConfigureCustomDomain () {
						await mod.ControlSettingStore('KVCSettingCustomDomainBaseURL', KVCWriteLogic.KVCWriteCustomDomainBaseURLData('FakeCustomDomainBaseURL'));

						if (mod._ValueNoteSelected) {
							await mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);
						}
					},
				},
			]);
		}

		outputData.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes(window, mod._ValueStorageClient, OLSKLocalized, OLSK_TESTING_BEHAVIOUR()));
		outputData.push(...OLSKServiceWorker.OLSKServiceWorkerRecipes(window, mod.DataNavigator(), OLSKLocalized, OLSK_TESTING_BEHAVIOUR()));

		if (mod.KVCWriteDetailInstance) {
			outputData.push(...mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailRecipes());
		}

		if (mod.DataRevealArchiveIsVisible()) {
			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemRevealArchive',
				LCHRecipeName: OLSKLocalized('KVCWriteMasterRevealArchiveButtonText'),
				LCHRecipeCallback: function KVCWriteLauncherItemRevealArchive () {
					mod.KVCWriteMasterDispatchRevealArchive();
				},
			});
		}

		return outputData;
	},

	DataRevealArchiveIsVisible () {
		return mod._ValueArchivedCount && mod._RevealArchiveIsVisible;
	},

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	DataVersionsIsDisabled () {
		return window.location.hostname !== window.OLSKPublicConstants('KVC_SHARED_REF_HOST');
	},

	DataDebugPersistenceIsEnabled () {
		if (OLSK_TESTING_BEHAVIOUR()) {
			return false;
		}

		if (window.location.hostname.includes('loc')) {
			return true;
		}

		return window.location.hostname === window.OLSKPublicConstants('KVC_SHARED_REF_HOST');
	},

	FakeNoteObjectValid(inputData) {
		return {
			KVCNoteBody: inputData || '',
		};
	},

	// INTERFACE	

	InterfaceWindowDidKeydown (event) {
		if (window.Launchlet.LCHSingletonExists()) {
			return;
		}

		const handlerFunctions = {
			Escape () {
				if (document.activeElement.nodeName === 'TEXTAREA') {
					return;
				}

				mod.ControlEscape();
			},
			Tab () {
				document.activeElement !== document.querySelector('.OLSKMasterListFilterField') ? document.querySelector('.OLSKMasterListFilterField').focus() : mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailEditorFocus();

				event.preventDefault();
			},
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	InterfaceStorageExportButtonDidClick () {
		mod.ControlNotesExportTXT();
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

		if (!mod.DataVersionsIsDisabled()) {
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
		}

		if (KVCNoteModel.KVCNoteModelIsPublic(inputData)) {
			OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSavePublishThrottleMap, inputData.KVCNoteID, {
				OLSKThrottleDuration: 1500,
				async OLSKThrottleCallback () {
					mod.ControlNotePublish(inputData);
				},
			});

			if (OLSK_TESTING_BEHAVIOUR()) {
				OLSKThrottle.OLSKThrottleSkip(mod._ValueSavePublishThrottleMap[inputData.KVCNoteID])	
			}
		}
	},

	async ControlNoteCreate(inputData) {
		const item = await KVCNoteAction.KVCNoteActionCreate(mod._ValueStorageClient, {
			KVCNoteBody: typeof inputData === 'string' ? inputData : '',
		});

		mod.ValueNotesAll(mod._ValueNotesAll.concat(item));

		mod.ControlNoteSelect(item);

		if (mod.DataIsMobile()) {
			mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailEditorFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailSetCursor(inputData.split('\n').length - 1, inputData.split('\n').pop().length);
	},
	
	_ControlHotfixUpdateInPlace(inputData) {
		mod.ControlNoteSelect(inputData);
		mod.KVCWriteDetailInstance.modPublic._KVCWriteDetailTriggerUpdate();
	},
	
	ControlNoteSelect(inputData) {
		mod.ValueNoteSelected(inputData);

		if (!inputData) {
			return !mod.DataIsMobile() && document.querySelector('.OLSKMasterListFilterField').focus();
		}

		mod.OLSKMobileViewInactive = true;

		if (mod.DataIsMobile()) {
			return;
		}
		
		mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailEditorFocus();
	},
	
	ControlNoteJump (inputData) {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: inputData,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler () {
				if (mod.DataIsMobile()) {
					return;
				}

				mod.KVCWriteDetailInstance.modPublic.KVCWriteDetailEditorFocus();
			},
		});
	},

	ControlNoteArchive (inputData) {
		inputData.KVCNoteIsArchived = true;

		mod.ControlNoteSave(inputData);

		mod.ControlNoteSelect(inputData); // #purge-svelte-force-update
	},
	
	ControlNoteUnarchive (inputData) {
		delete inputData.KVCNoteIsArchived;

		mod.ControlNoteSave(inputData);

		mod.ControlNoteSelect(inputData); // #purge-svelte-force-update
	},
	
	async ControlNotePublish (inputData) {
		if (OLSK_TESTING_BEHAVIOUR()) {
			window.TestControlNotePublishCount.innerHTML = parseInt(window.TestControlNotePublishCount.innerHTML) + 1;
		}

		const _references = [
			OLSKLocalized('KVCRootLinkText'),
			OLSKLocalized('KVCBacklinksHeadingText'),
			]; // #purge-translation-refs

		const options = {
			KVCOptionIsRoot: mod.DataSettingValue('KVCSettingPublicRootPageID') === inputData.KVCNoteID,
			KVCOptionRootURL: mod.DataSettingValue('KVCSettingCustomDomainBaseURL'),
			KVCOptionBacklinks: KVCWriteLogic.KVCWriteBacklinksMap(mod._ValueNotesAll.filter(KVCNoteModel.KVCNoteModelIsPublic).concat(inputData))[KVCTemplate.KVCTemplatePlaintextTitle(inputData.KVCNoteBody)],
		};
		
		mod.ValueNoteSelected(await KVCNoteAction.KVCNoteActionPublish(mod._ValueStorageClient, inputData, mod.TestPublishContent = KVCTemplate.KVCView(showdown, {
			KVCViewSource: inputData.KVCNoteBody,
			KVCViewPermalinkMap: await KVCNoteAction.KVCNoteActionPermalinkMap(mod._ValueStorageClient, mod.DataSettingValue('KVCSettingPublicRootPageID')),
			KVCViewTemplate: KVCTemplate.KVCTemplateViewDefault(OLSKLocalized),
			KVCViewTemplateOptions: options,
		}), options));
	},
	
	async ControlNoteRetract (inputData) {
		if (OLSK_TESTING_BEHAVIOUR()) {
			window.TestControlNoteRetractCount.innerHTML = parseInt(window.TestControlNoteRetractCount.innerHTML) + 1;
		}
		
		mod.ValueNoteSelected(await KVCNoteAction.KVCNoteActionRetract(mod._ValueStorageClient, inputData, mod.DataSettingValue('KVCSettingPublicRootPageID') === inputData.KVCNoteID));
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
		}), false);

		mod.ControlNoteSelect(null);

		await KVCNoteAction.KVCNoteActionDelete(mod._ValueStorageClient, inputData);
	},

	ControlEscape() {
		mod.ControlFilterWithNoThrottle('');

		mod.ValueArchivedCount(mod._ValueNotesAll);
		mod._RevealArchiveIsVisible = true;

		mod.ValueNotesVisible(mod._ValueNotesAll);
	},
	
	ControlFilterWithThrottle(inputData) {
		mod._ValueFilterText = inputData;

		OLSKThrottle.OLSKThrottleMappedTimeout(mod, '_ValueFilterThrottle', {
			OLSKThrottleDuration: 200,
			async OLSKThrottleCallback () {
				mod._RevealArchiveIsVisible = false;

				mod.ControlFilterWithNoThrottle(mod._ValueFilterText);
			},
		});

		if (OLSK_TESTING_BEHAVIOUR()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueFilterThrottle);
		}
	},
	
	ControlFilterWithNoThrottle(inputData) {
		mod.ReactFilter(mod._ValueFilterText = inputData);
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
			return KVCSettingStorage.KVCSettingStorageWrite(mod._ValueStorageClient, e);
		}));

		await Promise.all(outputData.KVCNoteObjects.map(function (e) {
			return KVCNoteStorage.KVCNoteStorageWrite(mod._ValueStorageClient, OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(e));
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
	
	async ControlSettingStore (param1, param2) {
		await KVCSettingStorage.KVCSettingStorageWrite(mod._ValueStorageClient, Object.assign(mod.DataSetting(param1) || mod._ValueSettingsAll.push(await KVCSettingAction.KVCSettingsActionProperty(mod._ValueStorageClient, param1, param2)), {
			KVCSettingValue: param2,
		}));
	},

	ControlMigrate() {
		KVCNoteStorage.KVCNoteStorageMigrateV1(mod._ValueStorageClient, mod.OLSKChangeDelegateCreateNote);

		if (OLSK_TESTING_BEHAVIOUR()) {
			window.TestControlMigrateCount.innerHTML = parseInt(window.TestControlMigrateCount.innerHTML) + 1;
		}

		mod._ValueDidMigrate = true;
	},

	// MESSAGE

	OLSKAppToolbarDispatchStorage () {
		mod._ValueStorageToolbarHidden = !mod._ValueStorageToolbarHidden;
	},

	OLSKAppToolbarDispatchLauncher () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: mod.DataRecipes(),
		});
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
		if (!inputData) {
			return mod.ControlEscape();
		}

		mod.ControlFilterWithThrottle(inputData);
	},

	KVCWriteMasterDispatchEscape () {
		mod.ControlEscape();
	},

	KVCWriteMasterDispatchRevealArchive () {
		mod._RevealArchiveIsVisible = false;

		mod.ValueNotesVisible(mod._ValueNotesAll);
	},

	KVCWriteMasterDelegateItemTitle (inputData) {
		return KVCTemplate.KVCTemplatePlaintextTitle(inputData);
	},

	KVCWriteMasterDelegateItemSnippet (inputData) {
		return KVCTemplate.KVCTemplatePlaintextSnippet(KVCTemplate.KVCTemplatePlaintextBody(inputData));
	},

	KVCWriteDetailPublicURLFor (inputData) {
		if (mod.DataSetting('KVCSettingCustomDomainBaseURL')) {
			return KVCWriteLogic.KVCWriteCustomDomainBaseURLFunction(KVCNoteStorage.KVCNoteStoragePublicURL(mod._ValueStorageClient, KVCNoteStorage.KVCNoteStoragePublicRootPagePath()), KVCNoteStorage.KVCNoteStoragePublicRootPagePath())(KVCNoteStorage.KVCNoteStoragePublicURL(mod._ValueStorageClient, KVCNoteAction.KVCNoteActionPublicPath(inputData, mod.DataSettingValue('KVCSettingPublicRootPageID') === inputData.KVCNoteID)), mod.DataSetting('KVCSettingCustomDomainBaseURL').KVCSettingValue);
		}
		
		if (OLSK_TESTING_BEHAVIOUR() && mod._ValueStorageIsConnected) {
			return '/FakePublicPath';
		}

		return KVCNoteStorage.KVCNoteStoragePublicURL(mod._ValueStorageClient, KVCNoteStorage.KVCNoteStoragePublicObjectPath(inputData));
	},

	KVCWriteDetailDispatchBack () {
		// mod.ControlNoteSelect(null);

		mod.OLSKMobileViewInactive = false;

		if (!mod.DataIsMobile()) {
			return;
		}

		const element = document.querySelector('.OLSKResultsListItemSelected');

		if (!element) {
			return;
		}

		setTimeout(function () {
			element.scrollIntoView({
				block: 'center',
				inline: 'center',
			});
		});
	},

	KVCWriteDetailDispatchJump (inputData) {
		mod.ControlNoteJump(inputData);
	},

	KVCWriteDetailDispatchArchive () {
		mod.ControlNoteArchive(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchUnarchive () {
		mod.ControlNoteUnarchive(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchConnect () {
		mod._ValueStorageToolbarHidden = false;
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
		if (mod.DataIsMobile()) {
			mod.KVCWriteDetailDispatchBack();
		}
		
		mod.ControlNoteDiscard(mod._ValueNoteSelected);
	},

	KVCWriteDetailDispatchUpdate () {
		mod._ValueNoteSelected = mod._ValueNoteSelected; // #purge-svelte-force-update
		
		mod.ControlNoteSave(mod._ValueNoteSelected);
	},

	async KVCWriteDetailDispatchSetAsRootPage (inputData) {
		await mod.ControlSettingStore('KVCSettingPublicRootPageID', inputData);

		await mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);

		if (KVCNoteModel.KVCNoteModelIsPublic(mod._ValueNoteSelected)) {
			mod.ControlNotePublish(mod._ValueNoteSelected);
		}
	},

	KVCWriteDetailDispatchOpen (inputData) {
		mod._RevealArchiveIsVisible = false; // #missing-spec

		mod.ControlFilterWithNoThrottle(inputData);
	},

	KVCWriteDetailDispatchEscape () {
		mod.ControlEscape();
	},

	_OLSKAppToolbarDispatchExport () {
		mod.ControlNotesExportData();
	},

	_OLSKAppToolbarDispatchImport (inputData) {
		mod.ControlNotesImportData(inputData);
	},

	OLSKChangeDelegateCreateNote (inputData) {
		// console.log('OLSKChangeDelegateCreate', inputData);

		mod.ValueNotesAll([inputData].concat(mod._ValueNotesAll.filter(function (e) {
			return e.KVCNoteID !== inputData.KVCNoteID; // @Hotfix Dropbox sending DelegateAdd
		})), !mod._ValueNoteSelected);
	},

	OLSKChangeDelegateUpdateNote (inputData) {
		// console.log('OLSKChangeDelegateUpdate', inputData);

		if (mod.DataDebugPersistenceIsEnabled()) {
			console.log('OLSKChangeDelegateUpdate', inputData.KVCNoteID, inputData.KVCNoteBody);
		}

		if (mod._ValueNoteSelected && mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID) {
			mod._ControlHotfixUpdateInPlace(inputData);
		}

		mod.ValueNotesAll(mod._ValueNotesAll.map(function (e) {
			return e.KVCNoteID === inputData.KVCNoteID ? inputData : e;
		}), !mod._ValueNoteSelected);
	},

	OLSKChangeDelegateDeleteNote (inputData) {
		// console.log('OLSKChangeDelegateDelete', inputData);

		if (mod._ValueNoteSelected && (mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID)) {
			mod.ControlNoteSelect(null);
		}

		mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
			return e.KVCNoteID !== inputData.KVCNoteID;
		}), false);
	},

	async OLSKChangeDelegateConflictNote (inputData) {
		return;
		return setTimeout(async function () {
			mod.OLSKChangeDelegateUpdateNote(await KVCNoteAction.KVCNoteActionUpdate(mod._ValueStorageClient, OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateConflictSelectRecent(inputData))))
		});
	},

	StorageConnected () {
		mod._ValueStorageIsConnected = true;
	},

	StorageNotConnected () {
		if (OLSK_TESTING_BEHAVIOUR() && window.location.search.match('FakeStorageIsConnected')) {
			return;
		}

		mod.ControlMigrate();
	},

	StorageSyncDone () {
		if (mod._ValueDidMigrate) {
			return;
		}

		mod.ControlMigrate();
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
			document.querySelector('.OLSKMasterListFilterField').focus();
		})
	},
	
	ReactFilter(inputData) {
		mod.ValueNotesVisible(mod._ValueNotesAll);

		if (!inputData) {
			return mod.ControlNoteSelect(null);
		}

		if (!mod._ValueNotesVisible.length) {
			return mod.ControlNoteSelect(null);
		}

		mod.ValueNoteSelected(mod._ValueNotesVisible.filter(function (e) {
			return KVCTemplate.KVCTemplatePlaintextTitle(e.KVCNoteBody).toLowerCase() === inputData.toLowerCase();
		}).concat(mod._ValueNotesVisible.filter(function (e) {
			if (e.KVCNoteIsArchived) {
				return false;
			}
			
			return KVCTemplate.KVCTemplatePlaintextTitle(e.KVCNoteBody).toLowerCase().includes(inputData.toLowerCase());
		})).shift());
	},

	// SETUP

	async SetupEverything () {
		mod.SetupStorageClient();

		mod.SetupRemoteStorage();

		mod.SetupStorageStatus();

		await mod.SetupStorageNotifications();

		await mod.SetupValueNotesAll();
		
		await mod.SetupValueSettingsAll();

		mod.ReactIsLoading(mod._ValueIsLoading = false);
	},

	SetupStorageClient() {
		const storageModule = KVC_Data.KVC_DataModule([
			Object.assign(KVCNoteStorage.KVCNoteStorageBuild, {
				OLSKChangeDelegate: {
					OLSKChangeDelegateCreate: mod.OLSKChangeDelegateCreateNote,
					OLSKChangeDelegateUpdate: mod.OLSKChangeDelegateUpdateNote,
					OLSKChangeDelegateDelete: mod.OLSKChangeDelegateDeleteNote,
					OLSKChangeDelegateConflict: mod.OLSKChangeDelegateConflictNote,
				},
			}),
			KVCSettingStorage.KVCSettingStorageBuild,
			KVCVersionStorage.KVCVersionStorageBuild,
			], {
			OLSKOptionIncludeDebug: OLSK_TESTING_BEHAVIOUR(),
		});
		
		mod._ValueStorageClient = new RemoteStorage({
			modules: [ storageModule ],
			OLSKPatchRemoteStorageAuthRedirectURI: OLSK_TESTING_BEHAVIOUR() ? undefined : window.location.origin + window.OLSKCanonicalFor('KVCWriteRoute'),
		});

		mod._ValueStorageClient.access.claim(storageModule.name, 'rw');

		mod._ValueStorageClient.caching.enable(`/${ storageModule.name }/`);
	},

	SetupRemoteStorage () {
		return
		mod._ValueStorageClient.setApiKeys(window.OLSKPublicConstants('KVCDropboxAppKey') ? {
			dropbox: window.atob(window.OLSKPublicConstants('KVCDropboxAppKey')),
			googledrive: window.atob(window.OLSKPublicConstants('KVCGoogleClientKey')),
		} : {});
	},

	SetupStorageStatus () {
		OLSKRemoteStorage.OLSKRemoteStorageStatus(mod._ValueStorageClient, function (inputData) {
			mod._ValueFooterStorageStatus = inputData;
		}, OLSKLocalized)
	},

	async SetupStorageNotifications () {
		mod._ValueStorageClient.on('connected', mod.StorageConnected);

		mod._ValueStorageClient.on('not-connected', mod.StorageNotConnected);

		mod._ValueStorageClient.on('sync-done', mod.StorageSyncDone);

		let isOffline;

		mod._ValueStorageClient.on('network-offline', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('network-offline', arguments);
			}

			isOffline = true;
		});

		mod._ValueStorageClient.on('network-online', () => {
			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('network-online', arguments);
			}
			
			isOffline = false;
		});

		mod._ValueStorageClient.on('error', (error) => {
			if (isOffline && inputData.message === 'Sync failed: Network request failed.') {
				return;
			};

			if (!OLSK_TESTING_BEHAVIOUR()) {
				console.debug('error', error);
			}
		});

		return new Promise(function (res, rej) {
			return mod._ValueStorageClient.on('ready', res);
		})
	},

	async SetupValueNotesAll() {
		const items = (await KVCNoteAction.KVCNoteActionQuery(mod._ValueStorageClient, {})).filter(function (e) {
			return typeof e === 'object'; // #patch-remotestorage-true
		});

		mod.ValueArchivedCount(items);
		
		mod._RevealArchiveIsVisible = mod._ValueArchivedCount > 0;
		
		mod.ValueNotesAll(items);
	},

	async SetupValueSettingsAll() {
		mod._ValueSettingsAll = await KVCSettingAction.KVCSettingsActionQuery(mod._ValueStorageClient, {});
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

import KVCWriteMaster from '../sub-master/main.svelte';
import KVCWriteDetail from '../sub-detail/main.svelte';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKServiceWorkerView from '../_shared/__external/OLSKServiceWorker/main.svelte';
import OLSKStorageWidget from 'OLSKStorageWidget';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="KVCWrite OLSKViewport" class:OLSKIsLoading={ mod._ValueIsLoading }>

<div class="OLSKViewportContent">
	<KVCWriteMaster
		KVCWriteMasterListItems={ mod._ValueNotesVisible }
		KVCWriteMasterListItemSelected={ mod._ValueNoteSelected }
		KVCWriteMasterFilterText={ mod._ValueFilterText }
		KVCWriteMasterRevealArchiveIsVisible={ mod.DataRevealArchiveIsVisible() }
		KVCWriteMasterDispatchCreate={ mod.KVCWriteMasterDispatchCreate }
		KVCWriteMasterDispatchClick={ mod.KVCWriteMasterDispatchClick }
		KVCWriteMasterDispatchArrow={ mod.KVCWriteMasterDispatchArrow }
		KVCWriteMasterDispatchFilter={ mod.KVCWriteMasterDispatchFilter }
		KVCWriteMasterDispatchEscape={ mod.KVCWriteMasterDispatchEscape }
		KVCWriteMasterDispatchRevealArchive={ mod.KVCWriteMasterDispatchRevealArchive }
		KVCWriteMasterDelegateItemTitle={ mod.KVCWriteMasterDelegateItemTitle }
		KVCWriteMasterDelegateItemSnippet={ mod.KVCWriteMasterDelegateItemSnippet }
		OLSKMobileViewInactive={ mod.OLSKMobileViewInactive }
		/>
	
	<KVCWriteDetail
		KVCWriteDetailConnected={ mod._ValueStorageIsConnected }
		KVCWriteDetailItemIsRootPage={ mod._ValueNoteSelected && mod.DataSetting('KVCSettingPublicRootPageID') ? mod._ValueNoteSelected.KVCNoteID === mod.DataSettingValue('KVCSettingPublicRootPageID') : false }
		KVCWriteDetailPublicURLFor={ mod.KVCWriteDetailPublicURLFor }
		KVCWriteDetailDispatchBack={ mod.KVCWriteDetailDispatchBack }
		KVCWriteDetailDispatchJump={ mod.KVCWriteDetailDispatchJump }
		KVCWriteDetailDispatchArchive={ mod.KVCWriteDetailDispatchArchive }
		KVCWriteDetailDispatchUnarchive={ mod.KVCWriteDetailDispatchUnarchive }
		KVCWriteDetailDispatchConnect={ mod.KVCWriteDetailDispatchConnect }
		KVCWriteDetailDispatchPublish={ mod.KVCWriteDetailDispatchPublish }
		KVCWriteDetailDispatchRetract={ mod.KVCWriteDetailDispatchRetract }
		KVCWriteDetailDispatchVersions={ mod.KVCWriteDetailDispatchVersions }
		KVCWriteDetailDispatchDiscard={ mod.KVCWriteDetailDispatchDiscard }
		KVCWriteDetailDispatchUpdate={ mod.KVCWriteDetailDispatchUpdate }
		KVCWriteDetailDispatchSetAsRootPage={ mod.KVCWriteDetailDispatchSetAsRootPage }
		KVCWriteDetailDispatchOpen={ mod.KVCWriteDetailDispatchOpen }
		KVCWriteDetailDispatchEscape={ mod.KVCWriteDetailDispatchEscape }
		OLSKMobileViewInactive={ !mod.OLSKMobileViewInactive }
		_KVCWriteDetailVersionsIsDisabled={ mod.DataVersionsIsDisabled() }
		bind:this={ mod.KVCWriteDetailInstance }
		/>
</div>

{#if OLSK_TESTING_BEHAVIOUR()}
	<p>
		<strong>TestControlNotePublishCount</strong>
		<span id="TestControlNotePublishCount">0</span>
	</p>
	
	<p>
		<strong>TestControlNoteRetractCount</strong>
		<span id="TestControlNoteRetractCount">0</span>
	</p>
	
	<p>
		<strong>TestControlMigrateCount</strong>
		<span id="TestControlMigrateCount">0</span>
	</p>
	
	<div>
		<strong>TestPublishContent</strong>
		<div id="TestPublishContent">{@html mod.TestPublishContent }</div>
	</div>
{/if}

<footer class="KVCWriteViewportFooter OLSKMobileViewFooter">

	{#if !mod._ValueStorageToolbarHidden }
		<div class="KVCWriteStorageToolbar OLSKStorageToolbar OLSKToolbar OLSKToolbarJustify">
			<div class="OLSKToolbarElementGroup">
				<button class="KVCWriteStorageExportButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" on:click={ mod.InterfaceStorageExportButtonDidClick }>{ OLSKLocalized('KVCWriteStorageExportButtonText') }</button>
			</div>

			<div class="OLSKToolbarElementGroup">
				<OLSKStorageWidget StorageClient={ mod._ValueStorageClient } />
			</div>
		</div>
	{/if}

	<OLSKAppToolbar
		OLSKAppToolbarDonateURL={ window.OLSKPublicConstants('KVC_SHARED_DONATE_URL') }
		OLSKAppToolbarStorageStatus={ mod._ValueFooterStorageStatus }
		OLSKAppToolbarDispatchStorage={ mod.OLSKAppToolbarDispatchStorage }
		_OLSKAppToolbarDispatchExport={ mod._OLSKAppToolbarDispatchExport }
		_OLSKAppToolbarDispatchImport={ mod._OLSKAppToolbarDispatchImport }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }
		/>
</footer>

</div>

{#if !OLSK_TESTING_BEHAVIOUR()}
	<OLSKServiceWorkerView OLSKServiceWorkerRegistrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style src="./ui-style.css"></style>
