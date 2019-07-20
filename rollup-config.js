import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import i18n from 'rollup-plugin-i18n';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

import pathPackage from 'path';
import globPackage from 'glob';

export default globPackage.sync(['os-app/**/svelte-start.js'], {
	matchBase: true,
}).filter(function (e) {
	return !e.match(/node_modules|_external/ig);
}).map(function (e, i) {
	return {
	  input: pathPackage.join(pathPackage.dirname(e), 'svelte-start.js'),
	  output: {
	  	sourcemap: true,
	  	format: 'iife',
	  	name: 'MainApp',
	    file: pathPackage.join(pathPackage.dirname(e), '_compiled/ui-behaviour.js'),
	  },
  	onwarn: (warning, handler) => {
  		if (['a11y-accesskey', 'a11y-autofocus'].indexOf(warning.pluginCode) !== -1) return;

  		handler(warning);
  	},
  	plugins: [
  		svelte({
  			// enable run-time checks when not in production
  			dev: !production,

  			// extract component CSS into separate file for better performance
  			css: function (css) {
  				return css.write(pathPackage.join(pathPackage.dirname(e), '_compiled/ui-style.css'));
  			}
  		}),

  		// If you have external dependencies installed from
  		// npm, you'll most likely need these plugins. In
  		// some cases you'll need additional configuration —
  		// consult the documentation for details:
  		// https://github.com/rollup/rollup-plugin-commonjs
  		resolve({
  			browser: true
  		}),
  		commonjs(),
      i18n({
        baseDirectory: 'os-app',
      }),

  		// Watch the `public` directory and refresh the
  		// browser on changes when not in production
  		!production && livereload({
  			watch: pathPackage.join(pathPackage.dirname(e), '_compiled'),
  			port: 5000 + i,
  		}),

  		// If we're building for production (npm run build
  		// instead of npm run dev), minify
  		production && terser()
  	],
  };
});
