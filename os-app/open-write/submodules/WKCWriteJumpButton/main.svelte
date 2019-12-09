<script>
export let WKCWriteJumpButtonRecipes = [];
export let WKCWriteJumpButtonDispatchComplete = null;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// INTERFACE
	
	InterfaceButtonDidClick() {
		setTimeout(mod.ControlLaunchlet);
	},

	InterfaceWindowDidKeydown () {
		if (event.ctrlKey && event.key === 'r' && WKCWriteJumpButtonRecipes.length) {
			return ControlLaunchlet();
		}
	},

	// CONTROL

	ControlLaunchlet () {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: WKCWriteJumpButtonRecipes,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler: WKCWriteJumpButtonDispatchComplete,
		});
	},

};
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown }/>

<button on:click={ mod.InterfaceButtonDidClick  } class="WKCWriteJumpButton OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" disabled={ !WKCWriteJumpButtonRecipes.length } accesskey="r" style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')" title={ OLSKLocalized('WKCWriteJumpButtonText') } tabindex="-1"></button>

<style>
</style>
