import RollupStart from './main.svelte';

const WKCWriteMaster = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteMasterListItems: [],
		WKCWriteMasterDispatchCreate () {
			window.TestWKCWriteMasterDispatchCreate.innerHTML = parseInt(window.TestWKCWriteMasterDispatchCreate.innerHTML) + 1;
		},
		WKCWriteMasterDispatchSelect (inputData) {
			window.TestWKCWriteMasterDispatchSelect.innerHTML = parseInt(window.TestWKCWriteMasterDispatchSelect.innerHTML) + 1;
			window.TestWKCWriteMasterDispatchSelectData.innerHTML = JSON.stringify(inputData);
		},
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['WKCWriteMasterListItems', 'WKCWriteMasterListItemSelected'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default WKCWriteMaster;
