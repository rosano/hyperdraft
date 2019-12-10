import RollupStart from './main.svelte';

const params = Object.fromEntries((new window.URLSearchParams(window.location.search)).entries());

const WKCWriteEditor = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteEditorDispatchHeaderTokens: (function _WKCWriteEditorDispatchHeaderTokens (inputData) {
			window.TestWKCWriteEditorDispatchHeaderTokens.innerHTML = parseInt(window.TestWKCWriteEditorDispatchHeaderTokens.innerHTML) + 1;
			window.TestWKCWriteEditorDispatchHeaderTokensData.innerHTML = JSON.stringify(inputData);
		}),
		WKCWriteEditorDispatchUpdate: (function _WKCWriteEditorDispatchUpdate (inputData) {
			window.TestWKCWriteEditorDispatchUpdate.innerHTML = parseInt(window.TestWKCWriteEditorDispatchUpdate.innerHTML) + 1;
			window.TestWKCWriteEditorDispatchUpdateData.innerHTML = inputData;
		}),
		WKCWriteEditorDispatchOpen: (function _WKCWriteEditorDispatchOpen () {}),
		WKCWriteEditorDispatchReady: (function _WKCWriteEditorDispatchReady () {}),
	}, Object.fromEntries(Object.entries(params).filter(function (e) {
		return e[0] !== 'WKCWriteEditorSetValue'
	}))),
});

if (params.WKCWriteEditorSetValue) {
	WKCWriteEditor.WKCWriteEditorSetValue(params.WKCWriteEditorSetValue);
}

window.WKCWriteEditorBehaviour = {

	TestWKCWriteEditorFocus () {
		WKCWriteEditor.WKCWriteEditorFocus();
	},

};

export default WKCWriteEditor;
