import RollupStart from './main.svelte';

const WKCWriteFooter = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteFooterDispatchStorage () {
			window.TestWKCWriteFooterDispatchStorage.innerHTML = parseInt(window.TestWKCWriteFooterDispatchStorage.innerHTML) + 1;
		},
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()))),
});

export default WKCWriteFooter;
