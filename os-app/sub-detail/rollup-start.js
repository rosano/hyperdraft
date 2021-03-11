import RollupStart from './main.svelte';

import OLSKRemoteStorage from 'OLSKRemoteStorage';

const params = Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
	if (['KVCWriteDetailItem', 'KVCWriteDetailConnected', 'KVCWriteDetailItemIsRootPage'].includes(e[0])) {
		e[1] = JSON.parse(e[1]);
	}

	if (e[0] === 'KVCWriteDetailItem') {
		e[1] = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(e[1]);
	}

	return e;
}));

const mod = {

	// INTERFACE

	InterfaceTestKVCWriteDetailEditorFocusButtonDidClick () {
		KVCWriteDetail.modPublic.KVCWriteDetailEditorFocus();
	},

	// REACT

	ReactDetailItem (inputData) {
		window.TestKVCWriteDetailItem.innerHTML = JSON.stringify(inputData);
	},

	// SETUP

	SetupEverything() {
		if (!params.KVCWriteDetailItem) {
			return;
		}
		
		mod.ReactDetailItem(params.KVCWriteDetailItem);
	},

	// LIFECYCLE

	LifecycleModuleDidLoad() {
		mod.SetupEverything();
	},
	
};
	
mod.LifecycleModuleDidLoad();

const KVCWriteDetail = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteDetailPublicURLFor: (function  (inputData) {
			return '[public]/' + inputData.KVCNotePublicID;
		}),
		KVCWriteDetailDispatchBack: (function  () {
			window.TestKVCWriteDetailDispatchBack.innerHTML = parseInt(window.TestKVCWriteDetailDispatchBack.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchJump: (function  () {
			window.TestKVCWriteDetailDispatchJump.innerHTML = parseInt(window.TestKVCWriteDetailDispatchJump.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchArchive: (function  () {
			window.TestKVCWriteDetailDispatchArchive.innerHTML = parseInt(window.TestKVCWriteDetailDispatchArchive.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchUnarchive: (function  () {
			window.TestKVCWriteDetailDispatchUnarchive.innerHTML = parseInt(window.TestKVCWriteDetailDispatchUnarchive.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchConnect: (function  () {
			window.TestKVCWriteDetailDispatchConnect.innerHTML = parseInt(window.TestKVCWriteDetailDispatchConnect.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchPublish: (function  () {
			window.TestKVCWriteDetailDispatchPublish.innerHTML = parseInt(window.TestKVCWriteDetailDispatchPublish.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchRetract: (function  () {
			window.TestKVCWriteDetailDispatchRetract.innerHTML = parseInt(window.TestKVCWriteDetailDispatchRetract.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchVersions: (function  () {
			window.TestKVCWriteDetailDispatchVersions.innerHTML = parseInt(window.TestKVCWriteDetailDispatchVersions.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchDiscard: (function  () {
			window.TestKVCWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestKVCWriteDetailDispatchDiscard.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchUpdate: (function  () {
			window.TestKVCWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestKVCWriteDetailDispatchUpdate.innerHTML) + 1;

			mod.ReactDetailItem(params.KVCWriteDetailItem);
		}),
		KVCWriteDetailDispatchSetAsRootPage: (function  (inputData) {
			window.TestKVCWriteDetailDispatchSetAsRootPage.innerHTML = parseInt(window.TestKVCWriteDetailDispatchSetAsRootPage.innerHTML) + 1;
			window.TestKVCWriteDetailDispatchSetAsRootPageData.innerHTML = inputData;
		}),
		KVCWriteDetailDispatchOpen: (function  () {}),
		KVCWriteDetailDispatchEscape: (function  () {}),
		_DebugLauncher: true,
	}, params),
});

KVCWriteDetail.modPublic.KVCWriteDetailSetItem(params.KVCWriteDetailItem);

window.KVCWriteDetailBehaviour = mod;

export default KVCWriteDetail;
