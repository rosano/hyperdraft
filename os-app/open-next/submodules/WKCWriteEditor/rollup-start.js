import RollupStart from './main.svelte';

const WKCWriteEditor = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteEditorDispatchUpdate: (function _WKCWriteEditorDispatchUpdate (inputData) {
			window.TestWKCWriteEditorDispatchUpdate.innerHTML = parseInt(window.TestWKCWriteEditorDispatchUpdate.innerHTML) + 1;
			window.TestWKCWriteEditorDispatchUpdateData.innerHTML = inputData;
		}),
		WKCWriteEditorDispatchOpen: (function _WKCWriteEditorDispatchOpen () {}),
		WKCWriteEditorDispatchReady: (function _WKCWriteEditorDispatchReady () {}),
	}, Object.fromEntries((new window.URLSearchParams(window.location.search)).entries())),
});

window.WKCWriteEditorBehaviour = {
	TestWKCWriteEditorFocus () {
		WKCWriteEditor.WKCWriteEditorFocus();
	},
};

export default WKCWriteEditor;
