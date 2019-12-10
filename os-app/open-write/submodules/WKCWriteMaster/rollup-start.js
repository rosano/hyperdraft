import RollupStart from './main.svelte';

const WKCWriteMaster = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteMasterListItems: [],
		WKCWriteMasterFilterText: '',
		WKCWriteMasterDispatchCreate: (function _WKCWriteMasterDispatchCreate (inputData) {
			window.TestWKCWriteMasterDispatchCreate.innerHTML = parseInt(window.TestWKCWriteMasterDispatchCreate.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchCreateData.innerHTML = inputData;
		}),
		WKCWriteMasterDispatchClick: (function _WKCWriteMasterDispatchClick (inputData) {
			window.TestWKCWriteMasterDispatchClick.innerHTML = parseInt(window.TestWKCWriteMasterDispatchClick.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchClickData.innerHTML = JSON.stringify(inputData);
		}),
		WKCWriteMasterDispatchArrow: (function _WKCWriteMasterDispatchArrow (inputData) {
			window.TestWKCWriteMasterDispatchArrow.innerHTML = parseInt(window.TestWKCWriteMasterDispatchArrow.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchArrowData.innerHTML = JSON.stringify(inputData);
		}),
		WKCWriteMasterDispatchFilter: (function _WKCWriteMasterDispatchFilter (inputData) {
			window.TestWKCWriteMasterDispatchFilter.innerHTML = parseInt(window.TestWKCWriteMasterDispatchFilter.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchFilterData.innerHTML = inputData;
		}),
		WKCWriteMasterDispatchExport: (function _WKCWriteMasterDispatchExport () {}),
		WKCWriteMasterDelegateItemTitle: (function _WKCWriteMasterDelegateItemTitle (inputData) {
			return inputData.split('\n').shift();
		}),
		WKCWriteMasterDelegateItemBody: (function _WKCWriteMasterDelegateItemBody (inputData) {
			return inputData.split('\n').slice(1).join('\n');
		}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e, index, coll) {
		if (['WKCWriteMasterListItems', 'WKCWriteMasterListItemSelected'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		if (e[0] === 'WKCWriteMasterListItemSelected') {
			e[1] = coll[0][1].filter(function (item) {
				return item.WKCNoteID === e[1].WKCNoteID;
			}).shift();
		}

		return e;
	}))),
});

export default WKCWriteMaster;
