import RollupStart from './main.svelte';

const params = Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
	if (['WKCWriteDetailItem'].includes(e[0])) {
		e[1] = JSON.parse(e[1]);
	}

	return e;
}));

const WKCWriteDetail = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCWriteDetailDispatchBack: (function _WKCWriteDetailDispatchBack () {
			window.TestWKCWriteDetailDispatchBack.innerHTML = parseInt(window.TestWKCWriteDetailDispatchBack.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchJump: (function _WKCWriteDetailDispatchJump (inputData) {
			window.TestWKCWriteDetailDispatchJump.innerHTML = parseInt(window.TestWKCWriteDetailDispatchJump.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchPublish: (function _WKCWriteDetailDispatchPublish (inputData) {
			window.TestWKCWriteDetailDispatchPublish.innerHTML = parseInt(window.TestWKCWriteDetailDispatchPublish.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchRetract: (function _WKCWriteDetailDispatchRetract (inputData) {
			window.TestWKCWriteDetailDispatchRetract.innerHTML = parseInt(window.TestWKCWriteDetailDispatchRetract.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchVersions: (function _WKCWriteDetailDispatchVersions (inputData) {
			window.TestWKCWriteDetailDispatchVersions.innerHTML = parseInt(window.TestWKCWriteDetailDispatchVersions.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchDiscard: (function _WKCWriteDetailDispatchDiscard (inputData) {
			window.TestWKCWriteDetailDispatchDiscard.innerHTML = parseInt(window.TestWKCWriteDetailDispatchDiscard.innerHTML) + 1;
		}),
		WKCWriteDetailDispatchUpdate: (function _WKCWriteDetailDispatchUpdate (inputData) {
			window.TestWKCWriteDetailDispatchUpdate.innerHTML = parseInt(window.TestWKCWriteDetailDispatchUpdate.innerHTML) + 1;
			window.TestWKCWriteDetailDispatchUpdateData.innerHTML = inputData;
		}),
		WKCWriteDetailDispatchOpen: (function _WKCWriteDetailDispatchOpen () {}),
	}, Object.fromEntries(Object.entries(params).filter(function (e) {
		return e[0] !== 'WKCWriteDetailItem'
	}))),
});

WKCWriteDetail.WKCWriteDetailSetItem(params.WKCWriteDetailItem);

window.WKCWriteDetailBehaviour = {

	TestWKCWriteDetailFocus () {
		WKCWriteDetail.WKCWriteDetailFocus();
	},

};

export default WKCWriteDetail;
