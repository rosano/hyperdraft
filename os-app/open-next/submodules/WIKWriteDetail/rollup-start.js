import RollupStart from './main.svelte';

const WIKWriteDetail = new RollupStart({
	target: document.body,
	props: Object.assign({
		WIKWriteDetailDispatchBack: (function _WIKWriteDetailDispatchBack () {
			window.TestWIKWriteDetailDispatchBack.innerHTML = parseInt(window.TestWIKWriteDetailDispatchBack.innerHTML) + 1;
		}),
		WIKWriteDetailDispatchDiscard: (function _WIKWriteDetailDispatchDiscard (inputData) {
			window.TestWIKWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestWIKWriteDetailDispatchDiscard.innerHTML) + 1;
			window.TestWIKWriteDetailDispatchDiscardData.innerHTML = JSON.stringify(inputData);
		}),
		WIKWriteDetailDispatchUpdate: (function _WIKWriteDetailDispatchUpdate () {
			window.TestWIKWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestWIKWriteDetailDispatchUpdate.innerHTML) + 1;
		}),
		WIKWriteDetailDispatchOpen: (function _WIKWriteDetailDispatchOpen () {}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['WIKWriteDetailItem'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default WIKWriteDetail;
