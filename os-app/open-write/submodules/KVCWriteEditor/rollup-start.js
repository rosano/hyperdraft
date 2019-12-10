import RollupStart from './main.svelte';

const params = Object.fromEntries((new window.URLSearchParams(window.location.search)).entries());

const KVCWriteEditor = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteEditorDispatchHeaderTokens: (function _KVCWriteEditorDispatchHeaderTokens (inputData) {
			window.TestKVCWriteEditorDispatchHeaderTokens.innerHTML = parseInt(window.TestKVCWriteEditorDispatchHeaderTokens.innerHTML) + 1;
			window.TestKVCWriteEditorDispatchHeaderTokensData.innerHTML = JSON.stringify(inputData);
		}),
		KVCWriteEditorDispatchUpdate: (function _KVCWriteEditorDispatchUpdate (inputData) {
			window.TestKVCWriteEditorDispatchUpdate.innerHTML = parseInt(window.TestKVCWriteEditorDispatchUpdate.innerHTML) + 1;
			window.TestKVCWriteEditorDispatchUpdateData.innerHTML = inputData;
		}),
		KVCWriteEditorDispatchOpen: (function _KVCWriteEditorDispatchOpen () {}),
		KVCWriteEditorDispatchReady: (function _KVCWriteEditorDispatchReady () {}),
	}, Object.fromEntries(Object.entries(params).filter(function (e) {
		return e[0] !== 'KVCWriteEditorSetValue'
	}))),
});

if (params.KVCWriteEditorSetValue) {
	KVCWriteEditor.KVCWriteEditorSetValue(params.KVCWriteEditorSetValue);
}

window.KVCWriteEditorBehaviour = {

	TestKVCWriteEditorFocus () {
		KVCWriteEditor.KVCWriteEditorFocus();
	},

};

export default KVCWriteEditor;
