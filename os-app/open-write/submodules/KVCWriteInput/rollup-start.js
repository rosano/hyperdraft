import RollupStart from './main.svelte';

const params = Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
	if (['KVCWriteInputItem'].includes(e[0])) {
		e[1] = JSON.parse(e[1]);
	}

	return e;
}));

const mod = {

	// INTERFACE

	InterfaceTestKVCWriteInputFocusButtonDidClick() {
		KVCWriteInput.KVCWriteInputFocus();
	},

	InterfaceTestKVCWriteInputPropDataSendButtonDidClick() {
		KVCWriteInput.KVCWriteInputItem = JSON.parse(window.TestKVCWriteInputPropData.value);
	},

};

const KVCWriteInput = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteInputDispatchHeaderTokens: (function _KVCWriteInputDispatchHeaderTokens (inputData) {
			window.TestKVCWriteInputDispatchHeaderTokens.innerHTML = parseInt(window.TestKVCWriteInputDispatchHeaderTokens.innerHTML) + 1;
			window.TestKVCWriteInputDispatchHeaderTokensData.innerHTML = JSON.stringify(inputData);
		}),
		KVCWriteInputDispatchUpdate: (function _KVCWriteInputDispatchUpdate (inputData) {
			window.TestKVCWriteInputDispatchUpdate.innerHTML = parseInt(window.TestKVCWriteInputDispatchUpdate.innerHTML) + 1;
		}),
		KVCWriteInputDispatchOpen: (function _KVCWriteInputDispatchOpen () {}),
		KVCWriteInputDispatchReady: (function _KVCWriteInputDispatchReady () {}),
		KVCWriteInputDispatchEscape: (function _KVCWriteInputDispatchEscape () {}),
	}, params),
});

window.KVCWriteInputBehaviour = mod;

export default KVCWriteInput;
