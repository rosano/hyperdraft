import RollupStart from './main.svelte';

const WIKWriteDetail = new RollupStart({
	target: document.body,
	props: Object.assign({
		WIKWriteDetailDispatchBack () {
			window.TestWIKWriteDetailDispatchBack.innerHTML = parseInt(window.TestWIKWriteDetailDispatchBack.innerHTML) + 1;
		},
		WIKWriteDetailDispatchDiscard (inputData) {
			window.TestWIKWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestWIKWriteDetailDispatchDiscard.innerHTML) + 1;
			window.TestWIKWriteDetailDispatchDiscardData.innerHTML = JSON.stringify(inputData);
		},
		WIKWriteDetailDispatchUpdate () {
			window.TestWIKWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestWIKWriteDetailDispatchUpdate.innerHTML) + 1;
		},
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['WIKWriteDetailItem'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default WIKWriteDetail;
