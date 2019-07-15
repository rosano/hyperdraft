import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const pathPackage = require('path');

const production = !process.env.ROLLUP_WATCH;

export default {
	input: pathPackage.join(__dirname, 'svelte-start.js'),
	onwarn: (warning, handler) => {
		if (['a11y-accesskey', 'a11y-autofocus'].indexOf(warning.pluginCode) !== -1) return;

		handler(warning);
	},
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'WIKWrite',
		file: pathPackage.join(__dirname, '_compiled/ui-behaviour.js'),
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: function (css) {
				return css.write(pathPackage.join(__dirname, '_compiled/ui-style.css'));
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

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(pathPackage.join(__dirname, '_compiled')),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
