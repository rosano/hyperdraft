import RollupStart from './main.svelte';

const KVCWriteMaster = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteMasterListItems: [],
		KVCWriteMasterFilterText: '',
		KVCWriteMasterDispatchCreate: (function _KVCWriteMasterDispatchCreate (inputData) {
			window.TestKVCWriteMasterDispatchCreate.innerHTML = parseInt(window.TestKVCWriteMasterDispatchCreate.innerHTML) + 1;
			window.TestKVCWriteMasterDispatchCreateData.innerHTML = inputData;
		}),
		KVCWriteMasterDispatchClick: (function _KVCWriteMasterDispatchClick (inputData) {
			window.TestKVCWriteMasterDispatchClick.innerHTML = parseInt(window.TestKVCWriteMasterDispatchClick.innerHTML) + 1;
			window.TestKVCWriteMasterDispatchClickData.innerHTML = JSON.stringify(inputData);
		}),
		KVCWriteMasterDispatchArrow: (function _KVCWriteMasterDispatchArrow (inputData) {
			window.TestKVCWriteMasterDispatchArrow.innerHTML = parseInt(window.TestKVCWriteMasterDispatchArrow.innerHTML) + 1;
			window.TestKVCWriteMasterDispatchArrowData.innerHTML = JSON.stringify(inputData);
		}),
		KVCWriteMasterDispatchFilter: (function _KVCWriteMasterDispatchFilter (inputData) {
			window.TestKVCWriteMasterDispatchFilter.innerHTML = parseInt(window.TestKVCWriteMasterDispatchFilter.innerHTML) + 1;
			window.TestKVCWriteMasterDispatchFilterData.innerHTML = inputData;
		}),
		KVCWriteMasterDispatchEscape: (function _KVCWriteMasterDispatchEscape () {
			window.TestKVCWriteMasterDispatchEscape.innerHTML = parseInt(window.TestKVCWriteMasterDispatchEscape.innerHTML) + 1;
		}),
		KVCWriteMasterDispatchExport: (function _KVCWriteMasterDispatchExport () {}),
		KVCWriteMasterDelegateItemTitle: (function _KVCWriteMasterDelegateItemTitle (inputData) {
			return inputData.split('\n').shift();
		}),
		KVCWriteMasterDelegateItemSnippet: (function _KVCWriteMasterDelegateItemSnippet (inputData) {
			return inputData.split('\n').slice(1).join('\n');
		}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e, index, coll) {
		if (['KVCWriteMasterListItems', 'KVCWriteMasterListItemSelected'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		if (e[0] === 'KVCWriteMasterListItemSelected') {
			e[1] = coll[0][1].filter(function (item) {
				return item.KVCNoteID === e[1].KVCNoteID;
			}).shift();
		}

		return e;
	}))),
});

export default KVCWriteMaster;
