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
import OLSKTransport from 'OLSKTransport';
import zerodatawrap from 'zerodatawrap';

const mod = {

	// VALUE

	_ValueIsLoading: true,

	_ValueRevealArchiveIsVisible: false,

	async ValueSetting (param1, param2) {
		await mod._ValueZDRWrap.App.KVCSetting.ZDRModelWriteObject({
			KVCSettingKey: param1,
			KVCSettingValue: param2,
		});

		mod._ValueSettingsAll[param1] = param2;
	},
	
	_ValueCloudToolbarHidden: true,

	_ValueSaveNoteThrottleMap: {},

	_ValueSavePublishThrottleMap: {},

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
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemBacklinksTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_SPEC_UI() ? '2001-02-03T04:05:06Z' : Date.now())), KVCWriteLogic.KVCWriteBacklinksMap(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll()), OLSKLocalized));
			},
		}, {
			LCHRecipeSignature: 'KVCWriteLauncherItemShowPublicNotes',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemShowPublicNotesText'),
			LCHRecipeCallback: function KVCWriteLauncherItemShowPublicNotes () {
				mod._OLSKCatalog.modPublic.OLSKCatalogFilterWithNoThrottle(KVCWriteLogic.KVCWritePublicSymbol());

				document.querySelector('.OLSKNarrowFilterField').focus();
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
			LCHRecipeSignature: 'KVCWriteLauncherItemExportZIP',
			LCHRecipeName: OLSKLocalized('KVCWriteLauncherItemExportZIPText'),
			LCHRecipeCallback: async function KVCWriteLauncherItemExportZIP () {
				const zip = new JSZip();

				mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().forEach(function (e) {
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
								
								if (mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected()) {
									await mod._ControlHotfixUpdateInPlace(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
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

					if (mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected()) {
						mod._ControlHotfixUpdateInPlace(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
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
						return mod.ZDRSchemaDispatchSyncUpdateNote(await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(Object.assign(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().filter(function (e) {
							return e.KVCNoteBody.match('FakeZDRSchemaDispatchSync');
						}).pop(), {
							KVCNoteBody: 'FakeZDRSchemaDispatchSyncUpdateNote',
						})));
					},
				},
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncDeleteNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncDeleteNote () {
						return mod.ZDRSchemaDispatchSyncDeleteNote(await mod._ValueZDRWrap.App.KVCNote.KVCNoteDelete(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().filter(function (e) {
							return e.KVCNoteBody.match('FakeZDRSchemaDispatchSync');
						}).pop()));
					},
				},
				{
					LCHRecipeName: 'FakeZDRSchemaDispatchSyncConflictNote',
					LCHRecipeCallback: async function FakeZDRSchemaDispatchSyncConflictNote () {
						const item = mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().filter(function (e) {
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
					LCHRecipeName: 'FakeConfigureCustomDomain',
					LCHRecipeCallback: async function FakeConfigureCustomDomain () {
						await mod.ValueSetting('KVCSettingCustomDomainBaseURL', KVCWriteLogic.KVCWriteCustomDomainBaseURLData('FakeCustomDomainBaseURL'));

						if (mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected()) {
							await mod._ControlHotfixUpdateInPlace(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
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

		outputData.push(...OLSKTransport.OLSKTransportRecipes({
			OLSKLocalized: OLSKLocalized,
			OLSKTransportDispatchImportJSON: mod.OLSKTransportDispatchImportJSON,
			OLSKTransportDispatchExportInput: mod.OLSKTransportDispatchExportInput,
			ParamSpecUI: OLSK_SPEC_UI(),
		}));

		if (mod._ValueZDRWrap.ZDRStorageProtocol === zerodatawrap.ZDRProtocolRemoteStorage()) {
			outputData.push(...OLSKRemoteStorage.OLSKRemoteStorageRecipes({
				ParamStorage: mod._ValueZDRWrap.ZDRStorageClient(),
				OLSKLocalized: OLSKLocalized,
				ParamMod: mod,
				ParamSpecUI: OLSK_SPEC_UI(),
			}));
		}

		outputData.push(...OLSKFund.OLSKFundRecipes({
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

		if (mod._ValueRevealArchiveIsVisible) {
			outputData.push({
				LCHRecipeSignature: 'KVCWriteLauncherItemRevealArchive',
				LCHRecipeName: OLSKLocalized('KVCWriteRevealArchiveButtonText'),
				LCHRecipeCallback: function KVCWriteLauncherItemRevealArchive () {
					mod.ControlRevealArchive();
				},
			});
		}

		return outputData;
	},

	DataExportZIPFilename () {
		return `${ OLSKTransport.OLSKTransportExportBasename() }.zip`;
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
			Tab () {
				document.activeElement !== document.querySelector('.OLSKNarrowFilterField') ? document.querySelector('.OLSKNarrowFilterField').focus() : (mod._KVCWriteDetail && mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus());

				event.preventDefault();
			},
		};

		handlerFunctions[event.key] && handlerFunctions[event.key]();
	},

	// CONTROL

	ControlNoteSave(inputData) {
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveNoteThrottleMap, inputData.KVCNoteID, {
			OLSKThrottleDuration: 500,
			async OLSKThrottleCallback () {
				OLSKVersion.OLSKVersionAdd({
					ParamMap: mod._ValueVersionMap,
					ParamKey: inputData.KVCNoteID,
					ParamData: await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(inputData),
					ParamLimit: parseInt('OLSK_VERSION_LIMIT_SWAP_TOKEN'),
				});

				mod.ControlLocalVersion();
			},
		});

		if (OLSK_SPEC_UI()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveNoteThrottleMap[inputData.KVCNoteID])	
		}

		if (KVCNote.KVCNoteIsMarkedPublic(inputData)) {
			OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSavePublishThrottleMap, inputData.KVCNoteID, {
				OLSKThrottleDuration: 1500,
				OLSKThrottleCallback () {
					mod.ControlNotePublish(inputData);
				},
			});

			if (OLSK_SPEC_UI()) {
				OLSKThrottle.OLSKThrottleSkip(mod._ValueSavePublishThrottleMap[inputData.KVCNoteID])	
			}
		}
	},

	ControlLocalVersion() {
		OLSKThrottle.OLSKThrottleMappedTimeout(mod._ValueSaveNoteThrottleMap, 'KVC_VERSION_MAP', {
			OLSKThrottleDuration: 50,
			async OLSKThrottleCallback () {
				OLSKLocalStorage.OLKSLocalStorageSet(window.localStorage, 'KVC_VERSION_MAP', mod._ValueVersionMap);
			},
		});

		if (OLSK_SPEC_UI()) {
			OLSKThrottle.OLSKThrottleSkip(mod._ValueSaveNoteThrottleMap['KVC_VERSION_MAP']);
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

		mod.ControlNoteActivate(mod._OLSKCatalog.modPublic.OLSKCatalogInsert(await mod._ValueZDRWrap.App.KVCNote.KVCNoteCreate({
			KVCNoteBody: typeof inputData === 'string' ? inputData : '',
		})));

		if (mod.DataIsMobile()) {
			mod._KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();
		}
		
		if (typeof inputData !== 'string') {
			return;
		}

		if (!inputData.match('\n')) {
			return;
		}

		setTimeout(function () {
			mod._KVCWriteDetail.modPublic.KVCWriteDetailSetCursor(inputData.split('\n').length - 1, inputData.split('\n').pop().length)
		}, 100);
	},
	
	_ControlHotfixUpdateInPlace(inputData) {
		mod.ControlNoteActivate(inputData);
		mod._KVCWriteDetail.modPublic._KVCWriteDetailTriggerUpdate();
	},
	
	ControlNoteActivate(inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);

		if (!inputData) {
			return;
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

		mod.ControlNoteActivate(inputData); // #purge-svelte-force-update
	},
	
	ControlNoteUnarchive (inputData) {
		delete inputData.KVCNoteIsArchived;

		mod.ControlNoteSave(inputData);

		mod.ControlNoteActivate(inputData); // #purge-svelte-force-update
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
			KVCOptionBacklinks: KVCWriteLogic.KVCWriteBacklinksMap(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll().filter(KVCNote.KVCNoteIsMarkedPublic).concat(inputData))[KVCTemplate.KVCTemplatePlaintextTitle(inputData.KVCNoteBody)],
			_KVCOptionPublicBaseURL: mod._ValueZDRWrap.Public.ZDRStoragePermalink('/'),
		};

		const wasPublic = KVCNote.KVCNoteIsMarkedPublic(inputData);

		const updated = await mod._ValueZDRWrap.App.KVCNote.KVCNotePublicFilesUpload(await mod._ValueZDRWrap.App.KVCNote.KVCNoteMarkPublic(inputData), mod.TestPublishContent = KVCTemplate.KVCView({
			KVCViewSource: inputData.KVCNoteBody,
			KVCViewPermalinkMap: mod._ValueZDRWrap.App.KVCNote.KVCNotePermalinkMap(mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll(), mod.DataSetting('KVCSettingPublicRootPageID') || ''),
			KVCViewTemplate: KVCTemplate.KVCTemplateViewDefault(OLSKLocalized),
			KVCViewTemplateOptions: options,
		}), options.KVCOptionIsRoot);

		if (wasPublic === KVCNote.KVCNoteIsMarkedPublic(updated)) {
			return;
		}
		
		mod._OLSKCatalog.modPublic.OLSKCatalogUpdate(updated); // #purge-svelte-force-update
	},
	
	async ControlNoteRetract (inputData) {
		if (OLSK_SPEC_UI()) {
			window.TestControlNoteRetractCount.innerHTML = parseInt(window.TestControlNoteRetractCount.innerHTML) + 1;
		}

		mod._OLSKCatalog.modPublic.OLSKCatalogUpdate(await mod._ValueZDRWrap.App.KVCNote.KVCNotePublicFilesRetract(await mod._ValueZDRWrap.App.KVCNote.KVCNoteMarkNotPublic(inputData), mod.DataSetting('KVCSettingPublicRootPageID') === inputData.KVCNoteID)); // #purge-svelte-force-update?
	},
	
	async ControlNoteVersions (inputData) {
		Launchlet.LCHTasksRun([{
			LCHRecipeCallback () {
				mod.ControlNoteCreate(KVCWriteLogic.KVCWriteLauncherItemVersionsTemplate(this.api.LCHDateLocalOffsetSubtracted(new Date(OLSK_SPEC_UI() ? '2001-02-03T04:05:06Z' : Date.now())), OLSKLocalized, (mod._ValueVersionMap[inputData.KVCNoteID] || []).map(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse).reverse()));
			},
			LCHRecipeURLFilter: '*',
		  LCHRecipeIsAutomatic: true,
		}]);
	},
	
	async ControlNoteDiscard (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogRemove(inputData);

		OLSKVersion.OLSKVersionClear(mod._ValueVersionMap, (await mod._ValueZDRWrap.App.KVCNote.KVCNoteDelete(inputData)).KVCNoteID);

		mod.ControlLocalVersion();
	},

	ControlRevealArchive () {
		mod._ValueRevealArchiveIsVisible = false;
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

	_OLSKCatalogDispatchKey (inputData) {
		return inputData.KVCNoteID;
	},

	OLSKCollectionDispatchClick (inputData) {
		mod.ControlNoteActivate(inputData);
	},

	OLSKCollectionDispatchArrow (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogSelect(inputData);
	},

	OLSKCatalogDispatchArchivedHide () {
		mod._ValueRevealArchiveIsVisible = true;
	},

	OLSKCatalogDispatchArchivedShow () {
		mod._ValueRevealArchiveIsVisible = false;
	},

	OLSKCatalogDispatchFilterSubmit (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogFilterWithNoThrottle('');

		mod.ControlNoteCreate(inputData + '\n\n');
	},

	OLSKCatalogDispatchQuantity (inputData) {
		mod._ValueDocumentRemainder = OLSKFund.OLSKFundRemainder(inputData, parseInt('KVC_FUND_DOCUMENT_LIMIT_SWAP_TOKEN'));
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
				ParamRouteConstant: window.OLSKPublicConstants('OLSKSharedActiveRouteConstant'),
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
			LCHOptionLanguage: window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage'),
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
			OLSKFundDispatchReceive: mod.OLSKFundDispatchReceive,
		});
	},

	_OLSKAppToolbarDispatchFundNotConnected () {
		if (!window.confirm(OLSKLocalized('OLSKRemoteStorageConnectConfirmText'))) {
			return;
		}

		mod._ValueCloudToolbarHidden = false;
	},

	OLSKAppToolbarDispatchCloud () {
		mod._ValueCloudToolbarHidden = !mod._ValueCloudToolbarHidden;
	},

	OLSKAppToolbarDispatchLauncher () {
		if (window.Launchlet.LCHSingletonExists()) {
			return window.Launchlet.LCHSingletonDestroy();
		}

		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: mod.DataWriteRecipes(),
			LCHOptionLanguage: window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage'),
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

			setTimeout(function () {
				window.location.reload();
			}, mod._ValueZDRWrap.ZDRStorageProtocol === zerodatawrap.ZDRProtocolFission() ? 1000 : 0); // #hotfix-fission-delay
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
		mod._OLSKCatalog.modPublic.OLSKCatalogFocusMaster();
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
		mod._ValueCloudToolbarHidden = false;
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
		mod.ControlNoteDiscard(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
	},

	KVCWriteDetailDispatchUpdate () {
		mod.ControlNoteSave(mod._OLSKCatalog.modPublic.OLSKCatalogUpdate(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected()));
	},

	async KVCWriteDetailDispatchSetAsRootPage (inputData) {
		await mod.ValueSetting('KVCSettingPublicRootPageID', inputData);

		await mod._ControlHotfixUpdateInPlace(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());

		if (KVCNote.KVCNoteIsMarkedPublic(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected())) {
			mod.ControlNotePublish(mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected());
		}
	},

	KVCWriteDetailDispatchOpen (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogFilterWithNoThrottle(inputData);
	},

	async OLSKTransportDispatchImportJSON (inputData) {
		await mod._ValueZDRWrap.App.KVCTransport.KVCTransportImport(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData));
		await mod.SetupCatalog();
	},

	async OLSKTransportDispatchExportInput () {
		return mod._ValueZDRWrap.App.KVCTransport.KVCTransportExport({
			KVCNote: mod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll(),
			KVCSetting: await mod._ValueZDRWrap.App.KVCSetting.KVCSettingList(),
		});
	},

	ZDRSchemaDispatchSyncCreateNote (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogInsert(inputData);
	},

	ZDRSchemaDispatchSyncUpdateNote (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogUpdate(inputData);
		
		if (!OLSK_SPEC_UI() && mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected() && mod._OLSKCatalog.modPublic.OLSKCatalogDataItemSelected().KVCNoteID === inputData.KVCNoteID) {
			mod._ControlHotfixUpdateInPlace(inputData);
		}
	},

	ZDRSchemaDispatchSyncDeleteNote (inputData) {
		mod._OLSKCatalog.modPublic.OLSKCatalogRemove(inputData);

		OLSKVersion.OLSKVersionClear(mod._ValueVersionMap, inputData.KVCNoteID);

		mod.ControlLocalVersion();
	},

	ZDRSchemaDispatchSyncConflictNote (inputData) {
		return setTimeout(async function () {
			mod._OLSKCatalog.modPublic.OLSKCatalogUpdate(await mod._ValueZDRWrap.App.KVCNote.KVCNoteUpdate(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateConflictSelectRecent(inputData))))
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
			document.querySelector('.OLSKNarrowFilterField').focus();
		})
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

		if (!(await mod._ValueZDRWrap.App.KVCNote.KVCNoteList()).map(mod._OLSKCatalog.modPublic.OLSKCatalogInsert).length) {
			mod.OLSKCatalogDispatchQuantity(0);
		}
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
			OLSK_FUND_API_URL: 'OLSK_FUND_API_URL_SWAP_TOKEN',
			ParamBody: {
				OLSKPactAuthType: mod._ValueZDRWrap.ZDRStorageProtocol === zerodatawrap.ZDRProtocolRemoteStorage() ? OLSKPact.OLSKPactAuthTypeRemoteStorage() : OLSKPact.OLSKPactAuthTypeFission(),
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
import KVCWriteListItem from '../sub-item/main.svelte';
import KVCWriteDetail from '../sub-detail/main.svelte';
import OLSKAppToolbar from 'OLSKAppToolbar';
import OLSKServiceWorkerView from '../../node_modules/OLSKServiceWorker/main.svelte';
import OLSKInstall from 'OLSKInstall';
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

	OLSKCollectionItemAccessibilitySummaryFunction={ KVCWriteLogic.KVCWriteAccessibilitySummary }
	OLSKCollectionItemClass={ 'OLSKCommonEdgeBottom' }
	OLSKNarrowFilterFieldPlaceholderText={ OLSKLocalized('KVCWriteFilterFieldText') }

	_OLSKCatalogArchiveField={ 'KVCNoteIsArchived' }
	
	OLSKCatalogSortFunction={ KVCWriteLogic.KVCWriteSortFunction }
	OLSKCatalogIsMatch={ KVCWriteLogic.KVCWriteIsMatch }
	OLSKCatalogExactSortFunction={ KVCWriteLogic.KVCWriteExactSortFunction }

	_OLSKCatalogDispatchKey={ mod._OLSKCatalogDispatchKey }

	OLSKCollectionDispatchClick={ mod.OLSKCollectionDispatchClick }
	OLSKCollectionDispatchArrow={ mod.OLSKCollectionDispatchArrow }
	OLSKCatalogDispatchArchivedHide={ mod.OLSKCatalogDispatchArchivedHide }
	OLSKCatalogDispatchArchivedShow={ mod.OLSKCatalogDispatchArchivedShow }
	OLSKCatalogDispatchFilterSubmit={ mod.OLSKCatalogDispatchFilterSubmit }
	OLSKCatalogDispatchQuantity={ mod.OLSKCatalogDispatchQuantity }

	let:OLSKCollectionItem
	>

	<!-- MASTER -->

	<div class="OLSKToolbarElementGroup" slot="OLSKNarrowToolbarTail">
		<button class="KVCWriteCreateButton OLSKDecorButtonNoStyle OLSKDecorTappable OLSKToolbarButton" title={ OLSKLocalized('KVCWriteCreateButtonText') } on:click={ mod.InterfaceCreateButtonDidClick } accesskey="n">
			<div class="KVCWriteCreateButtonImage">{@html OLSKUIAssets._OLSKSharedCreate }</div>
		</button>
	</div>

	<div class="OLSKNarrowBodyTail" slot="OLSKNarrowBodyTail">{#if mod._ValueRevealArchiveIsVisible }
		<button class="KVCWriteRevealArchiveButton OLSKDecorPress" on:click={ mod._OLSKCatalog.modPublic.OLSKCatalogRevealArchive }>{ OLSKLocalized('KVCWriteRevealArchiveButtonText') }</button>
	{/if}</div>

	<!-- LIST ITEM -->

	<div slot="OLSKCollectionItem">
		<KVCWriteListItem KVCWriteListItemObject={ OLSKCollectionItem } />
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

	{#if !mod._ValueCloudToolbarHidden }
		<div class="KVCWriteCloudToolbar OLSKToolbar OLSKToolbarJustify OLSKCommonEdgeTop">
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
		OLSKAppToolbarCloudConnected={ !!mod._ValueCloudIdentity }
		OLSKAppToolbarCloudOffline={ mod._ValueCloudIsOffline }
		OLSKAppToolbarCloudError={ !!mod._ValueCloudErrorText }
		OLSKAppToolbarDispatchFund={ mod._ValueOLSKFundGrant || OLSKFund.OLSKFundResponseIsPresent() ? null : mod.OLSKAppToolbarDispatchFund }
		OLSKAppToolbarDispatchCloud={ mod.OLSKAppToolbarDispatchCloud }
		OLSKAppToolbarDispatchLauncher={ mod.OLSKAppToolbarDispatchLauncher }
		/>

	<OLSKInstall />

	{#if !OLSK_SPEC_UI()}
		<OLSKServiceWorkerView OLSKServiceWorkerRegistrationRoute={ window.OLSKCanonical('WKCServiceWorkerRoute') } />
	{/if}
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

{#if mod._IsRunningDemo }
	<OLSKPointer />
{/if}

<style src="./ui-style.css"></style>
