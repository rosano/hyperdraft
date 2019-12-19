import RollupStart from './main.svelte';

const params = Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
	if (['KVCWriteDetailItem'].includes(e[0])) {
		e[1] = JSON.parse(e[1]);
	}

	return e;
}));

const mod = {

	// INTERFACE

	InterfaceTestKVCWriteDetailEditorFocusButtonDidClick () {
		KVCWriteDetail.KVCWriteDetailEditorFocus();
	},

	// REACT

	ReactDetailItem (inputData) {
		window.TestKVCWriteDetailItem.innerHTML = JSON.stringify(inputData);
	},

	// SETUP

	SetupEverything() {
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
		KVCWriteDetailDispatchBack: (function _KVCWriteDetailDispatchBack () {
			window.TestKVCWriteDetailDispatchBack.innerHTML = parseInt(window.TestKVCWriteDetailDispatchBack.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchJump: (function _KVCWriteDetailDispatchJump () {
			window.TestKVCWriteDetailDispatchJump.innerHTML = parseInt(window.TestKVCWriteDetailDispatchJump.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchPublish: (function _KVCWriteDetailDispatchPublish () {
			window.TestKVCWriteDetailDispatchPublish.innerHTML = parseInt(window.TestKVCWriteDetailDispatchPublish.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchRetract: (function _KVCWriteDetailDispatchRetract () {
			window.TestKVCWriteDetailDispatchRetract.innerHTML = parseInt(window.TestKVCWriteDetailDispatchRetract.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchVersions: (function _KVCWriteDetailDispatchVersions () {
			window.TestKVCWriteDetailDispatchVersions.innerHTML = parseInt(window.TestKVCWriteDetailDispatchVersions.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchDiscard: (function _KVCWriteDetailDispatchDiscard () {
			window.TestKVCWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestKVCWriteDetailDispatchDiscard.innerHTML) + 1;
		}),
		KVCWriteDetailDispatchUpdate: (function _KVCWriteDetailDispatchUpdate () {
			window.TestKVCWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestKVCWriteDetailDispatchUpdate.innerHTML) + 1;

			mod.ReactDetailItem(params.KVCWriteDetailItem);
		}),
		KVCWriteDetailDispatchOpen: (function _KVCWriteDetailDispatchOpen () {}),
	}, Object.fromEntries(Object.entries(params).filter(function (e) {
		return e[0] !== 'KVCWriteDetailItem';
	}))),
});

KVCWriteDetail.KVCWriteDetailSetItem(params.KVCWriteDetailItem);

window.KVCWriteDetailBehaviour = mod;

export default KVCWriteDetail;
