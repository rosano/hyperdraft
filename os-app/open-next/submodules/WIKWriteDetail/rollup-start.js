import RollupStart from './main.svelte';

const params = Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
	if (['WIKWriteDetailItem'].includes(e[0])) {
		e[1] = JSON.parse(e[1]);
	}

	return e;
}));

const WIKWriteDetail = new RollupStart({
	target: document.body,
	props: Object.assign({
		WIKWriteDetailDispatchBack: (function _WIKWriteDetailDispatchBack () {
			window.TestWIKWriteDetailDispatchBack.innerHTML = parseInt(window.TestWIKWriteDetailDispatchBack.innerHTML) + 1;
		}),
		WIKWriteDetailDispatchPublish: (function _WIKWriteDetailDispatchPublish (inputData) {
			window.TestWIKWriteDetailDispatchPublish.innerHTML = parseInt(window.TestWIKWriteDetailDispatchPublish.innerHTML) + 1;
		}),
		WIKWriteDetailDispatchVersions: (function _WIKWriteDetailDispatchVersions (inputData) {
			window.TestWIKWriteDetailDispatchVersions.innerHTML = parseInt(window.TestWIKWriteDetailDispatchVersions.innerHTML) + 1;
		}),
		WIKWriteDetailDispatchDiscard: (function _WIKWriteDetailDispatchDiscard (inputData) {
			window.TestWIKWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestWIKWriteDetailDispatchDiscard.innerHTML) + 1;
			window.TestWIKWriteDetailDispatchDiscardData.innerHTML = JSON.stringify(inputData);
		}),
		WIKWriteDetailDispatchUpdate: (function _WIKWriteDetailDispatchUpdate (inputData) {
			window.TestWIKWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestWIKWriteDetailDispatchUpdate.innerHTML) + 1;
			window.TestWIKWriteDetailDispatchUpdateData.innerHTML = inputData;
		}),
		WIKWriteDetailDispatchOpen: (function _WIKWriteDetailDispatchOpen () {}),
	}, Object.fromEntries(Object.entries(params).filter(function (e) {
		return e[0] !== 'WIKWriteDetailItem'
	}))),
});

WIKWriteDetail.WIKWriteDetailSetItem(params.WIKWriteDetailItem);

window.WIKWriteDetailBehaviour = {

	TestWIKWriteDetailFocus () {
		WIKWriteDetail.WIKWriteDetailFocus();
	},

};

export default WIKWriteDetail;
