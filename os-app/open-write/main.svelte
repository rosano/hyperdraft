<script>
import { OLSKLocalized } from 'OLSKInternational';
import OLSKThrottle from 'OLSKThrottle';
import KVCNote from '../_shared/KVCNote/main.js';
import KVCSetting from '../_shared/KVCSetting/main.js';
import KVCTransport from '../_shared/KVCTransport/main.js';
import { OLSK_SPEC_UI } from 'OLSKSpec';
import OLSKRemoteStorage from 'OLSKRemoteStorage';
import OLSKObject from 'OLSKObject';
import OLSKServiceWorker from 'OLSKServiceWorker';
import KVCWriteLogic from './ui-logic.js';
import RemoteStorage from 'remotestoragejs';
import KVCTemplate from '../_shared/KVCTemplate/main.js';
import OLSKString from 'OLSKString';
import OLSKLanguageSwitcher from 'OLSKLanguageSwitcher';
import OLSKFund from 'OLSKFund';
import OLSKVersion from 'OLSKVersion';
import OLSKLocalStorage from 'OLSKLocalStorage';
import OLSKPact from 'OLSKPact';
import OLSKChain from 'OLSKChain';
import OLSKBeacon from 'OLSKBeacon';
import zerodatawrap from 'zerodatawrap';

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

		mod.ReactDocumentRemainder();
	},

	_ValueNotesVisible: [],
	ValueNotesVisible (inputData, shouldSort = true) {
		let items = !mod._ValueFilterText ? inputData : inputData.filter(KVCWriteLogic.KVCWriteFilterFunction(mod._ValueFilterText));

		if (mod.DataRevealArchiveIsVisible()) {
			items = items.filter(function (e) {
				return !e.KVCNoteIsArchived;
			});
		}

		mod._ValueNotesVisible = shouldSort ? items.sort(KVCWriteLogic.KVCWriteLogicListSortFunction) : items;
	},
	
	_ValueNoteSelected: undefined,
	ValueNoteSelected (inputData) {
		mod._KVCWriteDetail.modPublic.KVCWriteDetailSetItem(mod._ValueNoteSelected = inputData);

		if (!inputData) {
			mod.OLSKMobileViewInactive = false;	
		}

		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	async ValueSetting (param1, param2) {
		await mod._ValueZDRWrap.App.KVCSetting.ZDRModelWriteObject({
			KVCSettingKey: param1,
			KVCSettingValue: param2,
		});

		mod._ValueSettingsAll[param1] = param2;
	},
	
	_ValueFilterText: '',
	
	_ValueStorageToolbarHidden: true,

	_ValueSaveNoteThrottleMap: {},

	_ValueSavePublishThrottleMap: {},

	OLSKMobileViewInactive: false,

	_IsRunningDemo: false,

	_ValueOLSKFundProgress: false,

	_ValueDocumentRemainder: '',

	// DATA

	DataSetting (inputData) {
		return mod._ValueSettingsAll[inputData];
	},

	DataNavigator () {
		return navigator.serviceWorker ? navigator : {
			serviceWorker: {},
		};
	},

	DataWriteRecipes () {
		const outputData = [{
			LCHRecipeSignature: 'KVCWriteLauncherItemJournal',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemJournalText'),
			LCHRecipeCallback: function KVCWriteLauncherItemJournal () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemJournalTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_SPEC_UI() ? '2001-02-03T04:05:06Z' : Date.now())), OLSKLocalized));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemBacklinks',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemBacklinksText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemBacklinks () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemBacklinksTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_SPEC_UI() ? '2001-02-03T04:05:06Z' : Date.now())), KVCWriteLogic.KVCWriteBacklinksMap(mod._ValueNotesAll), OLSKLocalized));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemShowPublicNotes',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemShowPublicNotesText'),
			LCHRecipeCallback: function KVCWriteLauncherItemShowPublicNotes () {
				mod.ControlFilterWithNoThrottle(KVCWriteLogic.KVCWriteLogicPublicSymbol());

				document.querySelector('.OLSKMasterListFilterField').focus();
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemImportJSON',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemImportJSONText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemImportJSON () {
				return mod.ControlNotesImportJSON(await this.api.LCHReadTextFile({
					accept: '.json',
				}));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemImportTXT',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemImportTXTText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemImportTXT () {
				return mod.ControlNotesImportTXT(await this.api.LCHReadTextFileObjects({
					accept: '.txt,.md',
					multiple: true,
				}));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemImportNV',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemImportNVText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemImportNV () {
				return mod.ControlNotesImportTXT(await this.api.LCHReadTextFileObjects({
					accept: '.txt,.md',
					multiple: true,
				}), true);
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemExportJSON',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemExportJSONText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemExportJSON () {
				return this.api.LCHSaveFile(await mod.DataExportJSON(), mod.DataExportJSONFilename());
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemExportZIP',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemExportZIPText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemExportZIP () {
				const zip = new JSZip();

				mod._ValueNotesAll.forEach(function (e) {
					zip.file(`${ e.KVCNoteID }.txt`, e.KVCNoteBody, {
						date: e.KVCNoteModificationDate,
					});
				});
				
				return saveAs(await zip.generateAsync({type: 'blob'}), mod.DataExportZIPFilename());
			},
		}];

		if (mod._ValueCloudIdentity) {
			let count = 0;
			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemConfigureCustomDomain',
				LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainText'),
				LCHRecipeCallback: function KVCWriteLauncherItemConfigureCustomDomain () {
					const prompt1 = !OLSK_SPEC_UI() || (OLSK_SPEC_UI() && !count);
					const prompt2 = !OLSK_SPEC_UI() || (OLSK_SPEC_UI() && count);
					const confirm3 = !OLSK_SPEC_UI() || (OLSK_SPEC_UI() && count == 2);

					if (prompt1) {
						if (window.prompt(OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt1QuestionText'), mod._ValueZDRWrap.Public.ZDRStoragePermalink(KVCNote.KVCNotePublicRootPagePath())) === null) {
							return;
						};
					}
					
					if (prompt2) {
						const callback = async function () {
							const response = OLSK_SPEC_UI() && confirm3 ? '' : window.prompt(OLSKLocalized('KVCWriteLauncherItemConfigureCustomDomainPrompt2QuestionText'));

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
								await mod.ValueSetting('KVCSettingCustomDomainBaseURL', item);
								
								if (mod._ValueNoteSelected) {
									await mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);
								}

								return 
							}
						};

						callback();
					}

					if (OLSK_SPEC_UI()) {
						count += 1;
					}
				},
			});

			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemRemoveCustomDomain',
				LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemRemoveCustomDomainText'),
				LCHRecipeCallback: async function KVCWriteLauncherItemRemoveCustomDomain () {
					await mod._ValueZDRWrap.App.KVCSetting.KVCSettingsDelete({
						KVCSettingKey: 'KVCSettingCustomDomainBaseURL',
					});

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

		if (OLSK_SPEC_UI()) {
			outputData.push(...[
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncCreateNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncCreateNote () {
						return mod.ZDRSchemaDispatchSyncCreateNote(await mod._ValueZDRWrap.App.KVCNote.KVCNoteCreate(mod.FakeNoteObjectValid('FakeZDRSchemaDispatchSyncCreateNote')));
					},
				},
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncUpdateNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncUpdateNote () {
						return mod.ZDRSchemaDispatchSyncUpdateNote(await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(Object.assign(mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeZDRSchemaDispatchSync');
						}).pop(), {
							KVCNoteBody: 'FakeZDRSchemaDispatchSyncUpdateNote',
						})));
					},
				},
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncDeleteNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncDeleteNote () {
						const item = mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeZDRSchemaDispatchSync');
						}).pop();
						
						await mod._ValueZDRWrap.App.KVCNote.KVCNoteDelete(item);
						
						return mod.ZDRSchemaDispatchSyncDeleteNote(item);
					},
				},
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncConflictNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncConflictNote () {
						const item = mod._ValueNotesAll.filter(function (e) {
							return e.KVCNoteBody.match('FakeZDRSchemaDispatchSyncConflictNote');
						}).pop();
						
						return mod.ZDRSchemaDispatchSyncConflictNote({
							origin: 'conflict',
							oldValue: JSON.parse(JSON.stringify(await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(Object.assign({}, item, {
								KVCNoteBody: item.KVCNoteBody + '-local',
							})))),
							newValue: JSON.parse(JSON.stringify(Object.assign({}, item, {
								KVCNoteBody: item.KVCNoteBody + '-remote',
							}))),
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
						mod._ValueZDRWrap.App.ZDRStorageWriteObject(KVCNote.KVCNoteObjectPathV1(item), item);
						await mod.SetupCatalog();
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
					LCHRecipeName: 'FakeConfigureCustomDomain',
					LCHRecipeCallback: async function FakeConfigureCustomDomain () {
						await mod.ValueSetting('KVCSettingCustomDomainBaseURL', KVCWriteLogic.KVCWriteCustomDomainBaseURLData('FakeCustomDomainBaseURL'));

						if (mod._ValueNoteSelected) {
							await mod._ControlHotfixUpdateInPlace(mod._ValueNoteSelected);
						}
					},
				},
				{
					LCHRecipeName: 'FakeFundDocumentLimit',
					LCHRecipeCallback: async function FakeFundDocumentLimit () {
						await Promise.all(Array.from(Array(mod._ValueDocumentRemainder)).map(function (e) {
							return mod._ValueZDRWrap.App.KVCNote.KVCNoteCreate({
								KVCNoteBody: Math.random().toString(),
							});
						}));

						return mod.SetupCatalog();
					},
				}, {
					LCHRecipeName: 'KVCWriteLauncherItemDebug_PromptFakeImportSerialized',
					LCHRecipeCallback: function KVCWriteLauncherItemDebug_PromptFakeImportSerialized () {
						return mod.InterfaceStorageInputFieldDidRead(window.prompt());
					},
				}, {
					LCHRecipeName: 'KVCWriteLauncherItemDebug_PromptFakeImportPlain',
					LCHRecipeCallback: function KVCWriteLauncherItemDebug_PromptFakeImportPlain () {
						return mod.ControlNotesImportTXT([Object.assign(new File([], Math.random().toString()), {
							lastModified: Date.now(),
						}, JSON.parse(window.prompt()))])
					},
				}, {
					LCHRecipeName: 'KVCWriteLauncherItemDebug_PromptFakeImportComplex',
					LCHRecipeCallback: function KVCWriteLauncherItemDebug_PromptFakeImportComplex () {
						return mod.ControlNotesImportTXT([Object.assign(new File([], Math.random().toString()), {
							lastModified: Date.now(),
						}, JSON.parse(window.prompt()))], true)
					},
				}, {
					LCHRecipeName: 'KVCWriteLauncherItemDebug_AlertFakeExportSerialized',
					LCHRecipeCallback: async function KVCWriteLauncherItemDebug_AlertFakeExportSerialized () {
						return window.alert(JSON.stringify({
							OLSKDownloadName: mod.DataExportJSONFilename(),
							OLSKDownloadData: await mod.DataExportJSON(),
						}));
					},
				}, {
					LCHRecipeName: 'KVCWriteLauncherItemDebug_AlertFakeExportCompressed',
					LCHRecipeCallback: function KVCWriteLauncherItemDebug_AlertFakeExportCompressed () {
						return window.alert(JSON.stringify({
							OLSKDownloadName: mod.DataExportZIPFilename(),
						}));
					},
				}
			]);
		}

		outputData.push(...zerodatawrap.ZDRRecipes({
			ParamMod: mod,
			ParamSpecUI: OLSK_SPEC_UI(),
		}));

		if (mod._ValueZDRWrap.ZDRStorageProtocol === zerodatawrap.ZDRProtocolRemoteStorage()) {
			outputData.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes({
				ParamWindow: window,
				ParamStorage: mod._ValueZDRWrap.ZDRStorageClient(),
				OLSKLocalized: OLSKLocalized,
				ParamMod: mod,
				ParamSpecUI: OLSK_SPEC_UI(),
			}));
		}

		outputData.push(...OLSKFund.OLSKFundRecipes({
			ParamWindow: window,
			OLSKLocalized: OLSKLocalized,
			ParamConnected: !!mod._ValueCloudIdentity,
			ParamAuthorized: !!mod._ValueFundClue,
			OLSKFundDispatchGrant: mod.OLSKFundDispatchGrant,
			OLSKFundDispatchPersist: mod.OLSKFundDispatchPersist,
			ParamMod: mod,
			ParamSpecUI: OLSK_SPEC_UI(),
		}));

		outputData.push(...OLSKServiceWorker.OLSKServiceWorkerRecipes(window, mod.DataNavigator(), OLSKLocalized, OLSK_SPEC_UI()));

		if (mod._KVCWriteDetail) {
			outputData.push(...mod._KVCWriteDetail.modPublic.KVCWriteDetailRecipes());
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

	async DataExportJSON () {
		return JSON.stringify(mod._ValueZDRWrap.App.KVCTransport.KVCTransportExport({
			KVCNote: mod._ValueNotesAll,
			KVCSetting: await mod._ValueZDRWrap.App.KVCSetting.KVCSettingList(),
		}));
	},

	DataExportBasename () {
		return `${ window.location.hostname }-${ Date.now() }`;
	},

	DataExportJSONFilename () {
		return `${ mod.DataExportBasename() }.json`;
	},

	DataExportZIPFilename () {
		return `${ mod.DataExportBasename() }.zip`;
	},

	DataIsEligible (inputData = {}) {
		return OLSKFund.OLSKFundIsEligible(Object.assign({
			ParamMinimumTier: 1,
			ParamCurrentProject: 'RP_003',
			ParamBundleProjects: ['RP_004', 'FakeBundleProject'],
			ParamGrantTier: OLSKFund.OLSKFundTier('OLSK_FUND_PRICING_STRING_SWAP_TOKEN', mod._ValueOLSKFundGrant),
			ParamGrantProject: mod._ValueOLSKFundGrant ? mod._ValueOLSKFundGrant.OLSKPactGrantProject : '',
		}, inputData));
	},

	DataIsMobile () {
		return window.innerWidth <= 760;
	},

	FakeNoteObjectValid(inputData) {
		return {
			KVCNoteBody: inputData || '',
		};
	},

	// INTERFACE

	InterfaceCreateButtonDidClick () {
		mod.ControlNoteCreate();
	},

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
				document.activeElement !== document.querySelector('.OLSKMasterListFilterField') ? document.querySelector('.OLSKMasterListFilterField').focus() : mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();

				event.preventDefault();
			},
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	InterfaceStorageInputFieldDidRead (inputData) {
		mod.ControlNotesImportJSON(inputData);
	},

	// CONTROL

	ControlNoteSave(inputData) {
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveNoteThrottleMap, inputData.KVCNoteID, {
			OLSKThrottleDuration: 500,
			OLSKThrottleCallback () {
				mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(inputData);

				OLSKLocalStorage.OLKSLocalStorageSet(window.localStorage, 'KVC_VERSION_MAP', OLSKVersion.OLSKVersionAdd(mod._ValueVersionMap, inputData.KVCNoteID, OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(JSON.parse(JSON.stringify(inputData)))));
			},
		});

		if (OLSK_SPEC_UI()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveNoteThrottleMap[inputData.KVCNoteID])	
		}

		if (KVCNote.KVCNoteIsMarkedPublic(inputData)) {
			OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSavePublishThrottleMap, inputData.KVCNoteID, {
				OLSKThrottleDuration: 1500,
				async OLSKThrottleCallback () {
					mod.ControlNotePublish(inputData);
				},
			});

			if (OLSK_SPEC_UI()) {
				OLSKThrottle.OLSKThrottleSkip(mod._ValueSavePublishThrottleMap[inputData.KVCNoteID])	
			}
		}
	},

	ControlFundGate () {
		if (!window.confirm(OLSKLocalized('OLSKFundGateText'))) {
			return;
		}

		mod.OLSKAppToolbarDispatchFund();
	},

	async ControlNoteCreate(inputData) {
		if (mod._ValueDocumentRemainder < 1 && !mod.DataIsEligible()) {
			return mod.ControlFundGate();
		}

		mod.ControlNoteSelect(mod._OLSKCatalog.modPublic.OLSKCatalogInsert(await mod._ValueZDRWrap.App.KVCNote.KVCNoteCreate({
			KVCNoteBody: typeof inputData === 'string' ? inputData : '',
		})));

		mod.ReactDocumentRemainder();

		if (mod.DataIsMobile()) {
			mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		mod._KVCWriteDetail.modPublic.KVCWriteDetailSetCursor(inputData.split('\n').length - 1, inputData.split('\n').pop().length);
	},
	
	_ControlHotfixUpdateInPlace(inputData) {
		mod.ControlNoteSelect(inputData);
		mod._KVCWriteDetail.modPublic._KVCWriteDetailTriggerUpdate();
	},
	
	ControlNoteSelect(inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);

		if (!inputData) {
			return !mod.DataIsMobile() && document.querySelector('.OLSKMasterListFilterField').focus();
		}

		mod._OLSKCatalog.modPublic.OLSKCatalogFocusDetail();

		if (mod.DataIsMobile()) {
			return;
		}

		setTimeout(function () {
			mod._KVCWriteDetail.modPublic.KVCWriteDetailSetItem(inputData);

			mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();
		}, 100);
	},
	
	ControlNoteJump (inputData) {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: inputData,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler () {
				if (mod.DataIsMobile()) {
					return;
				}

				mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();
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
		if (OLSK_SPEC_UI()) {
			window.TestControlNotePublishCount.innerHTML = parseInt(window.TestControlNotePublishCount.innerHTML) + 1;
		}

		const _references = [
			OLSKLocalized('KVCRootLinkText'),
			OLSKLocalized('KVCBacklinksHeadingText'),
			]; // #purge-translation-refs

		const options = {
			KVCOptionIsRoot: mod.DataSetting('KVCSettingPublicRootPageID') === inputData.KVCNoteID,
			KVCOptionRootURL: mod._ValueZDRWrap.Public.ZDRStoragePermalink('index.html'),
			KVCOptionBacklinks: KVCWriteLogic.KVCWriteBacklinksMap(mod._ValueNotesAll.filter(KVCNote.KVCNoteIsMarkedPublic).concat(inputData))[KVCTemplate.KVCTemplatePlaintextTitle(inputData.KVCNoteBody)],
			_KVCOptionPublicBaseURL: mod._ValueZDRWrap.Public.ZDRStoragePermalink('/'),
		};

		const wasPublic = KVCNote.KVCNoteIsMarkedPublic(inputData);

		const updated = await mod._ValueZDRWrap.App.KVCNote.KVCNotePublicFilesUpload(await mod._ValueZDRWrap.App.KVCNote.KVCNoteMarkPublic(inputData), mod.TestPublishContent = KVCTemplate.KVCView({
			KVCViewSource: inputData.KVCNoteBody,
			KVCViewPermalinkMap: mod._ValueZDRWrap.App.KVCNote.KVCNotePermalinkMap(mod._ValueNotesAll, mod.DataSetting('KVCSettingPublicRootPageID') || ''),
			KVCViewTemplate: KVCTemplate.KVCTemplateViewDefault(OLSKLocalized),
			KVCViewTemplateOptions: options,
		}), options.KVCOptionIsRoot);

		if (wasPublic === KVCNote.KVCNoteIsMarkedPublic(updated)) {
			return;
		}
		
		mod.ValueNoteSelected(updated); // #purge-svelte-force-update
	},
	
	async ControlNoteRetract (inputData) {
		if (OLSK_SPEC_UI()) {
			window.TestControlNoteRetractCount.innerHTML = parseInt(window.TestControlNoteRetractCount.innerHTML) + 1;
		}

		mod.ValueNoteSelected(await mod._ValueZDRWrap.App.KVCNote.KVCNotePublicFilesRetract(await mod._ValueZDRWrap.App.KVCNote.KVCNoteMarkNotPublic(inputData), mod.DataSetting('KVCSettingPublicRootPageID') === inputData.KVCNoteID));
	},
	
	async ControlNoteVersions (inputData) {
		Launchlet.LCHTasksRun([{
			LCHRecipeCallback () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_SPEC_UI() ? '2001-02-03T04:05:06Z' : Date.now())), OLSKLocalized, (mod._ValueVersionMap[inputData.KVCNoteID] || []).map(function (e) {
					return e.KVCNoteBody;
				}).reverse()));
			},
			LCHRecipeURLFilter: '*',
		  LCHRecipeIsAutomatic: true,
		}]);
	},
	
	async ControlNoteDiscard (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogRemove(inputData);

		mod.ReactDocumentRemainder();

		await mod._ValueZDRWrap.App.KVCNote.KVCNoteDelete(inputData);
	},

	ControlEscape() {
		mod.ControlFilterWithNoThrottle('');

		mod.ValueArchivedCount(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll());
		
		mod._RevealArchiveIsVisible = !!mod._ValueArchivedCount;

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

		if (OLSK_SPEC_UI()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueFilterThrottle);
		}
	},
	
	ControlFilterWithNoThrottle(inputData) {
		mod.ReactFilter(mod._ValueFilterText = inputData);
	},

	async ControlNotesImportJSON (inputData) {
		if (!inputData.trim()) {
			return window.alert(OLSKLocalized('KVCWriteLauncherItemImportJSONErrorNotFilledAlertText'))
		}

		try {
			await mod._ValueZDRWrap.App.KVCTransport.KVCTransportImport(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(JSON.parse(inputData)));
			await mod.SetupCatalog();
		} catch (e) {
			window.alert(OLSKLocalized('KVCWriteLauncherItemImportJSONErrorNotValidAlertText'));
		}
	},

	async ControlNotesImportTXT (inputData, extractFilename) {
		await mod._ValueZDRWrap.App.KVCTransport.KVCTransportImport({
			KVCNote: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData.map(function (e) {
				return KVCWriteLogic.KVCWriteFileNoteObject(e, extractFilename);
			})),
		});
		await mod.SetupCatalog();
	},

	async ControlDemo () {
		mod._IsRunningDemo = true;
		window.OLSK_DEMO = true;

		return OLSKChain.OLSKChainGather(Object.assign({
			Wait: OLSKBeacon.OLSKBeaconWait,
			Point: (function (param1, param2) {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconPointFunction('.OLSKPointer', param1), param2);
			}),
			Click: (function (inputData) {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconClickFunction(inputData, '.OLSKPointer', 'OLSKPointerActive'));
			}),
			ClickLink: (function (inputData) {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconClickFunction(inputData, '.OLSKPointer', 'OLSKPointerActive', 'mouseup'));
			}),
			Defer: (function (inputData) {
				return OLSKBeacon.OLSKBeaconDeferFunction(inputData);
			}),
			Focus: (function (inputData) {
				return new Promise(function (resolve) {
					resolve(document.querySelector(inputData).focus());
				});
			}),
			Fill: (function (param1, param2, param3) {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconFillFunction(param1, param2), param3);
			}),
			Increment: (function (param1, param2, param3) {
				const startValue = OLSKDemoEditor.getValue();
				return OLSKBeacon._OLSKBeaconAnimate(function (pct) {
					window.OLSKDemoEditor.setValue(startValue + param2.slice(0, param2.length * pct));
				}, param3);
			}),
			Set: (function (param1, param2) {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconSetFunction(param1, param2));
			}),
			Nudge: (function () {
				return OLSKBeacon._OLSKBeaconAnimate(OLSKBeacon.OLSKBeaconNudgeFunction('.OLSKPointer', ...arguments));
			}),
		}, mod))
			.Point('.KVCWriteCreateButton')
			.Nudge(0, 50)
			.Wait()
			.Point('.KVCWriteCreateButton')
			.Click('.KVCWriteCreateButton')
			.Nudge(0, -200)
			.Increment('.KVCWriteInput .CodeMirror', 'Hello')
			.Wait()
			.Increment('.KVCWriteInput .CodeMirror', "\n\nLet's make some notes.", 1000)
			.Wait(1500)
			.Click('.KVCWriteCreateButton')
			.Increment('.KVCWriteInput .CodeMirror', 'Apples')
			.Wait()
			.Click('.KVCWriteCreateButton')
			.Increment('.KVCWriteInput .CodeMirror', 'Bananas')
			.Wait()
			.Click('.KVCWriteCreateButton')
			.Increment('.KVCWriteInput .CodeMirror', 'Cookies')
			.Wait()
			.Click('.KVCWriteCreateButton')
			.Wait(1000)
			.Increment('.KVCWriteInput .CodeMirror', "Make links using brackets")
			.Wait()
			.Increment('.KVCWriteInput .CodeMirror', "\n\n# For example")
			.Wait()
			.Increment('.KVCWriteInput .CodeMirror', "\nAlex likes [[apples]].")
			.Wait(1500)
			.Increment('.KVCWriteInput .CodeMirror', "\n\nClick to open the note.")
			.Wait(1000)
			.Point('.cm-link', 1500)
			.Wait(1000)
			.ClickLink('.cm-link')
			.Wait(1000)
			.Increment('.KVCWriteInput .CodeMirror', "\n\nThey also like [[bananas]].")
			.Wait()
			.Point('.cm-link')
			.ClickLink('.cm-link')
			.Wait()
			.Increment('.KVCWriteInput .CodeMirror', "\n\nBut [[cookies]] are their favourite thing to eat.")
			.Wait()
			.Point('.cm-link')
			// .ClickLink('.cm-link')
			// .Wait()
			.Wait()
			.Increment('.KVCWriteInput .CodeMirror', "\n\nNow you try!")
			.OLSKChainExecute();
	},

	// MESSAGE

	OLSKCatalogDispatchClick (inputData) {
		mod.ControlNoteSelect(inputData);
	},

	OLSKCatalogDispatchArrow (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	_OLSKCatalogDispatchKey (inputData) {
		return inputData.KVCNoteID;
	},

	OLSKAppToolbarDispatchApropos () {
		mod._OLSKModalView.modPublic.OLSKModalViewShow();
	},

	OLSKAppToolbarDispatchTongue () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		// #hotfix launchlet show all items
		let selected;

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: OLSKLanguageSwitcher.OLSKLanguageSwitcherRecipes({
				ParamLanguageCodes: window.OLSKPublicConstants('OLSKSharedPageLanguagesAvailable'),
				ParamCurrentLanguage: window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage'),
				ParamSpecUI: OLSK_SPEC_UI(),
				ParamWindow: window,
				OLSKLocalized,
				ParamRouteConstant: window.OLSKPublicConstants('OLSKSharedActiveRouteConstant'),
				OLSKFormatted: OLSKString.OLSKStringFormatted,
				OLSKCanonical: window.OLSKCanonical,
			}).map(function (e) {
				const item = e.LCHRecipeCallback;

				return Object.assign(e, {
					LCHRecipeCallback () {
						selected = item;
					},
				})
			}),
			LCHOptionCompletionHandler () {
			  selected && selected();
			},
			LCHOptionMode: Launchlet.LCHModePreview,
		});
	},

	OLSKAppToolbarDispatchFund () {
		if (!mod._ValueCloudIdentity) {
			return mod._OLSKAppToolbarDispatchFundNotConnected();
		}

		mod._ValueFundURL = OLSKFund.OLSKFundURL({
			ParamFormURL: 'OLSK_FUND_FORM_URL_SWAP_TOKEN',
			ParamProject: 'RP_003',
			ParamIdentity: mod._ValueCloudIdentity,
			ParamHomeURL: window.location.origin + window.location.pathname,
		});

		mod._OLSKWebView.modPublic.OLSKModalViewShow();

		OLSKFund.OLSKFundListen({
			ParamWindow: window,
			OLSKFundDispatchReceive: mod.OLSKFundDispatchReceive,
		});
	},

	_OLSKAppToolbarDispatchFundNotConnected () {
		if (!window.confirm(OLSKLocalized('OLSKRemoteStorageConnectConfirmText'))) {
			return;
		}

		mod._ValueStorageToolbarHidden = false;
	},

	OLSKAppToolbarDispatchStorage () {
		mod._ValueStorageToolbarHidden = !mod._ValueStorageToolbarHidden;
	},

	OLSKAppToolbarDispatchLauncher () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: mod.DataWriteRecipes(),
		});
	},

	OLSKFundDispatchReceive (inputData) {
		mod._OLSKWebView.modPublic.OLSKModalViewClose();

		return mod.OLSKFundDispatchPersist(inputData);
	},

	OLSKFundDispatchPersist (inputData) {
		mod._ValueFundClue = inputData;

		if (!inputData) {
			return mod._ValueZDRWrap.App.KVCSetting.KVCSettingsDelete({
				KVCSettingKey: 'KVCSettingFundClue',
			});
		}

		return mod.ValueSetting('KVCSettingFundClue', inputData).then(function () {
			if (OLSK_SPEC_UI()) {
				return;
			}

			window.location.reload();
		});
	},

	OLSKFundDispatchProgress (inputData) {
		mod._ValueOLSKFundProgress = inputData;
	},

	OLSKFundDispatchFail () {
		mod.OLSKFundDispatchPersist(null);
	},

	OLSKFundDispatchGrant (inputData) {
		mod._ValueOLSKFundGrant = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData);
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
		return OLSKString.OLSKStringSnippet(KVCTemplate.KVCTemplatePlaintextBody(inputData));
	},

	KVCWriteDetailPublicURLFor (inputData) {
		if (mod.DataSetting('KVCSettingCustomDomainBaseURL')) {
			return KVCWriteLogic.KVCWriteCustomDomainBaseURLFunction(mod._ValueZDRWrap.Public.ZDRStoragePermalink(KVCNote.KVCNotePublicRootPagePath()), KVCNote.KVCNotePublicRootPagePath())(mod._ValueZDRWrap.Public.ZDRStoragePermalink(KVCNote.KVCNotePublicPath(inputData, mod.DataSetting('KVCSettingPublicRootPageID') === inputData.KVCNoteID)), mod.DataSetting('KVCSettingCustomDomainBaseURL'));
		}
		
		if (OLSK_SPEC_UI() && mod._ValueCloudIdentity) {
			return '/FakePublicPath';
		}

		return mod._ValueZDRWrap.Public.ZDRStoragePermalink(KVCNote.KVCNotePublicChildPagePath(inputData));
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
		mod.ControlNoteArchive(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchUnarchive () {
		mod.ControlNoteUnarchive(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchConnect () {
		mod._ValueStorageToolbarHidden = false;
	},

	KVCWriteDetailDispatchPublish () {
		mod.ControlNotePublish(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchRetract () {
		mod.ControlNoteRetract(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchVersions () {
		mod.ControlNoteVersions(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchDiscard () {
		if (mod.DataIsMobile()) {
			mod.KVCWriteDetailDispatchBack();
		}
		
		mod.ControlNoteDiscard(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchUpdate () {
		mod.ControlNoteSave(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	async KVCWriteDetailDispatchSetAsRootPage (inputData) {
		await mod.ValueSetting('KVCSettingPublicRootPageID', inputData);

		await mod._ControlHotfixUpdateInPlace(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());

		if (KVCNote.KVCNoteIsMarkedPublic(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected())) {
			mod.ControlNotePublish(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
		}
	},

	KVCWriteDetailDispatchOpen (inputData) {
		mod._RevealArchiveIsVisible = false; // #missing-spec

		mod.ControlFilterWithNoThrottle(inputData);
	},

	KVCWriteDetailDispatchEscape () {
		mod.ControlEscape();
	},

	ZDRSchemaDispatchSyncCreateNote (inputData) {
		mod.ValueNotesAll([inputData].concat(mod._ValueNotesAll.filter(function (e) {
			return e.KVCNoteID !== inputData.KVCNoteID; // @Hotfix Dropbox sending DelegateAdd
		})), !mod._ValueNoteSelected);
	},

	ZDRSchemaDispatchSyncUpdateNote (inputData) {
		if (mod._ValueNoteSelected && mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID) {
			mod._ControlHotfixUpdateInPlace(inputData);
		}

		mod.ValueNotesAll(mod._ValueNotesAll.map(function (e) {
			return e.KVCNoteID === inputData.KVCNoteID ? inputData : e;
		}), !mod._ValueNoteSelected);
	},

	ZDRSchemaDispatchSyncDeleteNote (inputData) {
		if (mod._ValueNoteSelected && (mod._ValueNoteSelected.KVCNoteID === inputData.KVCNoteID)) {
			mod.ControlNoteSelect(null);
		}

		mod.ValueNotesAll(mod._ValueNotesAll.filter(function (e) {
			return e.KVCNoteID !== inputData.KVCNoteID;
		}), false);
	},

	async ZDRSchemaDispatchSyncConflictNote (inputData) {
		return setTimeout(async function () {
			mod.ZDRSchemaDispatchSyncUpdateNote(await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateConflictSelectRecent(inputData))))
		}, OLSK_SPEC_UI() ? 0 : 500);
	},

	async OLSKCloudFormDispatchSubmit (inputData) {
		const protocol = zerodatawrap.ZDRPreferenceProtocolConnect(inputData);
		(zerodatawrap.ZDRPreferenceProtocolMigrate() ? await mod.DataStorageClient(protocol) : mod._ValueZDRWrap).ZDRCloudConnect(inputData);
	},

	OLSKCloudDispatchRenew () {
		mod._ValueZDRWrap.ZDRCloudReconnect(mod._ValueCloudIdentity);
	},

	OLSKCloudStatusDispatchDisconnect () {
		mod._ValueZDRWrap.ZDRCloudDisconnect();

		mod._ValueCloudIdentity = null;

		zerodatawrap.ZDRPreferenceProtocolClear();
	},

	ZDRParamDispatchError (error) {
		mod._ValueCloudErrorText = error.toString();
	},

	ZDRParamDispatchConnected (identity, token) {
		mod._ValueCloudIdentity = identity;
		mod._ValueCloudToken = token;
	},

	ZDRParamDispatchOnline () {
		mod._ValueCloudIsOffline = false;
	},

	ZDRParamDispatchOffline () {
		mod._ValueCloudIsOffline = true;
	},

	ZDRParamDispatchSyncDidStart () {
		mod._ValueIsSyncing = true;
	},

	ZDRParamDispatchSyncDidStop () {
		mod._ValueIsSyncing = false;
	},

	OLSKCloudStatusDispatchSyncStart () {
		if (mod._ValueZDRWrap.ZDRStorageProtocol !== zerodatawrap.ZDRProtocolRemoteStorage()) {
			return;
		}

		mod._ValueZDRWrap.ZDRStorageClient().startSync();

		mod.ZDRParamDispatchSyncDidStart();
	},

	OLSKCloudStatusDispatchSyncStop () {
		if (mod._ValueZDRWrap.ZDRStorageProtocol !== zerodatawrap.ZDRProtocolRemoteStorage()) {
			return;
		}

		mod._ValueZDRWrap.ZDRStorageClient().stopSync();
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

	async ReactDocumentRemainder () {
		mod._ValueDocumentRemainder = OLSKFund.OLSKFundRemainder(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().length, parseInt('KVC_FUND_DOCUMENT_LIMIT_SWAP_TOKEN'));
	},

	// SETUP

	async SetupEverything () {
		await mod.SetupStorageClient();

		await mod.SetupCatalog();
		
		await mod.SetupValueSettingsAll();

		mod.SetupValueVersionsMap();

		mod.SetupFund();

		mod.ReactIsLoading(mod._ValueIsLoading = false);

		// mod.ControlDemo();
	},

	DataStorageClient (inputData) {
		return zerodatawrap.ZDRWrap({
			ZDRParamLibrary: (function() {
				if (inputData === zerodatawrap.ZDRProtocolFission()) {
					return webnative;
				}

				return RemoteStorage;
			})(),
			ZDRParamScopes: [{
				ZDRScopeKey: 'App',
				ZDRScopeDirectory: 'wikiavec',
				ZDRScopeCreatorDirectory: 'rCreativ',
				ZDRScopeSchemas: [
					Object.assign(KVCNote, {
						ZDRSchemaDispatchSyncCreate: mod.ZDRSchemaDispatchSyncCreateNote,
						ZDRSchemaDispatchSyncUpdate: mod.ZDRSchemaDispatchSyncUpdateNote,
						ZDRSchemaDispatchSyncDelete: mod.ZDRSchemaDispatchSyncDeleteNote,
						ZDRSchemaDispatchSyncConflict: mod.ZDRSchemaDispatchSyncConflictNote,
					}),
					KVCSetting,
					KVCTransport,
					],
			}, {
				ZDRScopeKey: 'Public',
				ZDRScopeDirectory: 'wikiavec',
				ZDRScopeIsPublic: true,
			}],
			ZDRParamDispatchError: mod.ZDRParamDispatchError,
			ZDRParamDispatchConnected: mod.ZDRParamDispatchConnected,
			ZDRParamDispatchOnline: mod.ZDRParamDispatchOnline,
			ZDRParamDispatchOffline: mod.ZDRParamDispatchOffline,
			_ZDRParamDispatchJSONPreStringify: OLSKObject.OLSKObjectSafeCopy,
			_ZDRParamDispatchJSONPostParse: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse,
		})
	},

	async SetupStorageClient() {
		mod._ValueZDRWrap = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocol(zerodatawrap.ZDRProtocolRemoteStorage()));
	},

	async SetupCatalog() {
		if (zerodatawrap.ZDRPreferenceProtocolMigrate()) {
			const client = await mod.DataStorageClient(zerodatawrap.ZDRPreferenceProtocolMigrate());

			await Promise.all((await client.App.ZDRStoragePathsRecursive('/')).map(async function (e) {
				await mod._ValueZDRWrap.App.ZDRStorageWriteObject(e, await client.App.ZDRStorageReadObject(e));
				await client.App.ZDRStorageDeleteFile(e);
			}));

			zerodatawrap.ZDRPreferenceProtocolMigrateClear();

			client.ZDRCloudDisconnect();
		};

		const items = await mod._ValueZDRWrap.App.KVCNote.KVCNoteList();

		mod.ValueArchivedCount(items);
		
		mod._RevealArchiveIsVisible = mod._ValueArchivedCount > 0;

		items.map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert);

		mod.ReactDocumentRemainder();
	},

	async SetupValueSettingsAll() {
		mod._ValueSettingsAll = Object.fromEntries((await mod._ValueZDRWrap.App.KVCSetting.KVCSettingList()).map(function (e) {
			return [e.KVCSettingKey, e.KVCSettingValue];
		}));
	},

	SetupValueVersionsMap () {
		mod._ValueVersionMap = OLSKLocalStorage.OLKSLocalStorageGet(window.localStorage, 'KVC_VERSION_MAP') || {};
	},

	async SetupFund () {
		if (OLSK_SPEC_UI() && window.location.search.match('FakeOLSKFundResponseIsPresent=true')) {
			OLSKFund._OLSKFundFakeGrantResponseRandom();
		}

		mod._ValueFundClue = mod.DataSetting('KVCSettingFundClue');

		await OLSKFund.OLSKFundSetupPostPay({
			ParamWindow: window,
			ParamExistingClue: mod._ValueFundClue || null,
			OLSKFundDispatchPersist: mod.OLSKFundDispatchPersist,
		});

		if (!mod._ValueCloudIdentity) {
			return;
		}

		if (!mod._ValueFundClue) {
			return;
		}
		
		const item = {
			OLSK_CRYPTO_PAIR_RECEIVER_PRIVATE: `OLSK_CRYPTO_PAIR_RECEIVER_PRIVATE_SWAP_TOKEN${ '' }`, // #purge
			OLSK_CRYPTO_PAIR_SENDER_PUBLIC: 'OLSK_CRYPTO_PAIR_SENDER_PUBLIC_SWAP_TOKEN',
			ParamWindow: window,
			OLSK_FUND_API_URL: 'OLSK_FUND_API_URL_SWAP_TOKEN',
			ParamBody: {
				OLSKPactAuthType: OLSKPact.OLSKPactAuthTypeRemoteStorage(),
				OLSKPactAuthIdentity: mod._ValueCloudIdentity,
				OLSKPactAuthProof: mod._ValueCloudToken,
				OLSKPactAuthMetadata: {
					OLSKPactAuthMetadataModuleName: 'wikiavec',
					OLSKPactAuthMetadataFolderPath: KVCNote.KVCNoteDirectory() + '/',
				},
				OLSKPactPayIdentity: mod._ValueCloudIdentity,
				OLSKPactPayClue: mod._ValueFundClue,
			},
			OLSKLocalized,
			OLSKFundDispatchProgress: mod.OLSKFundDispatchProgress,
			OLSKFundDispatchFail: mod.OLSKFundDispatchFail,
			OLSKFundDispatchGrant: mod.OLSKFundDispatchGrant,
		};

		return OLSKFund.OLSKFundSetupGrant(item);
	},

	// LIFECYCLE

	LifecycleModuleWillMount() {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleWillMount);

import OLSKCatalog from 'OLSKCatalog';
import KVCWriteMasterListItem from '../sub-listing/main.svelte';
import KVCWriteDetail from '../sub-detail/main.svelte';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKServiceWorkerView from '../_shared/__external/OLSKServiceWorker/main.svelte';
import OLSKCloud from 'OLSKCloud';
import OLSKWebView from 'OLSKWebView';
import OLSKModalView from 'OLSKModalView';
import OLSKApropos from 'OLSKApropos';
import OLSKPointer from 'OLSKPointer';
import OLSKUIAssets from 'OLSKUIAssets';
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="KVCWrite OLSKViewport" class:OLSKIsLoading={ mod._ValueIsLoading } class:OLSKIsDemoing={ mod._IsRunningDemo }>

<div class="OLSKViewportContent">

<OLSKCatalog
	bind:this={ mod._OLSKCatalog }

	OLSKMasterListItemAccessibilitySummaryFor={ KVCWriteLogic.KVCWriteAccessibilitySummary }

	OLSKMasterListFilterFieldPlaceholderText={ OLSKLocalized('KVCWriteFilterFieldText') }

	_OLSKCatalogExcludeField={ 'KVCNoteIsArchived' }

	OLSKCatalogDispatchClick={ mod.OLSKCatalogDispatchClick }
	OLSKCatalogDispatchArrow={ mod.OLSKCatalogDispatchArrow }
	
	OLSKCatalogSortFunction={ KVCWriteLogic.KVCWriteLogicListSortFunction }
	OLSKCatalogDispatchFilterFunction={ KVCWriteLogic.KVCWriteFilterFunction }
	OLSKCatalogDispatchExactFunction={ KVCWriteLogic.KVCWriteExactFunction }

	_OLSKCatalogDispatchKey={ mod._OLSKCatalogDispatchKey }

	let:OLSKResultsListItem
	>

	<!-- MASTER -->

	<div class="OLSKToolbarElementGroup" slot="OLSKMasterListToolbarTail">
		<button class="KVCWriteCreateButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteCreateButtonText') } on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">
			<div class="KVCWriteCreateButtonImage">{@html OLSKUIAssets._OLSKSharedCreate }</div>
		</button>
	</div>

	<div class="OLSKMasterListBodyTail" slot="OLSKMasterListBodyTail">{#if mod._RevealArchiveIsVisible }
		<button class="KVCWriteMasterRevealArchiveButton OLSKDecorPress" on:click={ mod.KVCWriteMasterDispatchRevealArchive }>{ OLSKLocalized('KVCWriteMasterRevealArchiveButtonText') }</button>
	{/if}</div>

	<!-- LIST ITEM -->

	<div slot="OLSKMasterListItem">
		<KVCWriteMasterListItem KVCWriteMasterListItemObject={ OLSKResultsListItem } />
	</div>

	<!-- DETAIL -->
	
	<div class="KVCWriteDetailContainer" slot="OLSKCatalogDetailContent" let:OLSKCatalogItemSelected>
		<KVCWriteDetail
			KVCWriteDetailItem={ OLSKCatalogItemSelected }
			KVCWriteDetailItemIsRootPage={ OLSKCatalogItemSelected && mod.DataSetting('KVCSettingPublicRootPageID') ? OLSKCatalogItemSelected.KVCNoteID === mod.DataSetting('KVCSettingPublicRootPageID') : false }
			KVCWriteDetailConnected={ mod._ValueCloudIdentity }
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
			bind:this={ mod._KVCWriteDetail }
			/>
	</div>

</OLSKCatalog>

</div>

{#if OLSK_SPEC_UI()}
	<p>
		<strong>ControlNotePublishCount</strong>
		<span id="TestControlNotePublishCount">0</span>
	</p>
	
	<p>
		<strong>ControlNoteRetractCount</strong>
		<span id="TestControlNoteRetractCount">0</span>
	</p>
	
	<div>
		<strong>PublishContent</strong>
		<div id="TestPublishContent">{@html mod.TestPublishContent }</div>
	</div>
{/if}

<footer class="KVCWriteViewportFooter OLSKMobileViewFooter">

	{#if !mod._ValueStorageToolbarHidden }
		<div class="KVCWriteStorageToolbar OLSKStorageToolbar OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeTop">
			<div class="OLSKToolbarElementGroup">
			</div>

			<div class="OLSKToolbarElementGroup">
				<OLSKCloud
					OLSKCloudErrorText={ mod._ValueCloudErrorText }
					OLSKCloudDispatchRenew={ mod.OLSKCloudDispatchRenew }
					OLSKCloudFormDispatchSubmit={ mod.OLSKCloudFormDispatchSubmit }
					OLSKCloudStatusIdentityText={ mod._ValueCloudIdentity }
					OLSKCloudStatusIsSyncing={ mod._ValueIsSyncing }
					OLSKCloudStatusDispatchSyncStart={ mod.OLSKCloudStatusDispatchSyncStart }
					OLSKCloudStatusDispatchSyncStop={ mod.OLSKCloudStatusDispatchSyncStop }
					OLSKCloudStatusDispatchDisconnect={ mod.OLSKCloudStatusDispatchDisconnect }
					/>
			</div>
		</div>
	{/if}

	<OLSKAppToolbar
		OLSKAppToolbarDispatchApropos={ mod.OLSKAppToolbarDispatchApropos }
		OLSKAppToolbarDispatchTongue={ mod.OLSKAppToolbarDispatchTongue }
		OLSKAppToolbarGuideURL={ window.OLSKCanonical('KVCGuideRoute') }
		OLSKAppToolbarFundShowProgress={ mod._ValueOLSKFundProgress }
		OLSKAppToolbarFundLimitText={ mod._ValueDocumentRemainder }
		OLSKAppToolbarDispatchFund={ mod._ValueOLSKFundGrant || OLSKFund.OLSKFundResponseIsPresent() ? null : mod.OLSKAppToolbarDispatchFund }
		OLSKAppToolbarCloudConnected={ !!mod._ValueCloudIdentity }
		OLSKAppToolbarCloudOffline={ mod._ValueCloudIsOffline }
		OLSKAppToolbarCloudError={ !!mod._ValueCloudErrorText }
		OLSKAppToolbarDispatchStorage={ mod.OLSKAppToolbarDispatchStorage }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }
		/>
</footer>

</div>

{#if !!mod._ValueCloudIdentity }
	<OLSKWebView OLSKModalViewTitleText={ OLSKLocalized('OLSKFundWebViewTitleText') } OLSKWebViewURL={ mod._ValueFundURL } bind:this={ mod._OLSKWebView } DEBUG_OLSKWebViewDataSource={ OLSK_SPEC_UI() } />
{/if}

<OLSKModalView OLSKModalViewTitleText={ OLSKLocalized('OLSKAproposHeadingText') } bind:this={ mod._OLSKModalView } OLSKModalViewIsCapped={ true }>
	<OLSKApropos
		OLSKAproposFeedbackValue={ `javascript:window.location.href = window.atob('${ window.btoa(OLSKString.OLSKStringFormatted(window.atob('OLSK_APROPOS_FEEDBACK_EMAIL_SWAP_TOKEN'), 'RP_003' + (mod._ValueFundClue ? '+' + mod._ValueFundClue : ''))) }')` }
		/>
</OLSKModalView>

{#if !OLSK_SPEC_UI()}
	<OLSKServiceWorkerView OLSKServiceWorkerRegistrationRoute={ window.OLSKCanonical('WKCServiceWorkerRoute') } />
{/if}

{#if mod._IsRunningDemo }
	<OLSKPointer />
{/if}

<style src="./ui-style.css"></style>
