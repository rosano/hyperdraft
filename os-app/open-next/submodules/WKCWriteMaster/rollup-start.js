import RollupStart from './main.svelte';

const WKCWriteMaster = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteMasterListItems: [],
		WKCWriteMasterDispatchCreate: (function _WKCWriteMasterDispatchCreate (inputData) {
			window.TestWKCWriteMasterDispatchCreate.innerHTML = parseInt(window.TestWKCWriteMasterDispatchCreate.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchCreateData.innerHTML = inputData;
		}),
		WKCWriteMasterDispatchSelect: (function _WKCWriteMasterDispatchSelect (inputData) {
			window.TestWKCWriteMasterDispatchSelect.innerHTML = parseInt(window.TestWKCWriteMasterDispatchSelect.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchSelectData.innerHTML = JSON.stringify(inputData);
		}),
		WKCWriteMasterDelegateItemTitle: (function _WKCWriteMasterDelegateItemTitle (inputData) {
			return inputData.WKCNoteBody.split('\n').shift();
		}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e, index, coll) {
		if (['WKCWriteMasterListItems', 'WKCWriteMasterListItemSelected'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		if (e[0] === 'WKCWriteMasterListItemSelected') {
			e[1] = coll[0][1].filter(function (item) {
				return item.WKCDocumentID === e[1].WKCDocumentID;
			}).shift();
		}

		return e;
	}))),
});

export default WKCWriteMaster;
