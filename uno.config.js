import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	cli: {
		entry: {
			outFile: './assets/css/uno.css',
			patterns: [
				'./{templates,handlers}/**/*.templ',
				'./assets/**/*.{js,css,html}',
				'!./assets/uno.css',
			],
		},
	},
	presets: [
		presetIcons(),
		presetTypography(),
		presetUno({
			dark: 'media',
		}),
		presetWebFonts({
			fonts: {
				display: {
					name: 'Cal Sans',
				},
				sans: {
					name: 'Karla',
				},
			},
			provider: 'none',
		}),
	],
	rules: [
		['w-screen', [[ 'width', '100vw' ], [ 'width', '100dvw' ]]],
		[/^w-(\d+)dvw$/, ([_, d]) => {
			return [
				['width', `${d}vw`],
				['width', `${d}dvw`],
			]
		}],
		['h-screen', [[ 'height', '100vh' ], [ 'height', '100dvh' ]]],
		[/^h-(\d+)dvh$/, ([_, d]) => {
			return [
				['height', `${d}vh`],
				['height', `${d}dvh`],
			]
		}],
	],
	theme: {
		colors: {
			white: 'var(--white)',
			black: 'var(--black)',
			cyan: 'var(--cyan)',
			purple: 'var(--purple)',
			foreground: {
				'00': 'var(--foreground-00)',
			},
			background: {
				'00': 'var(--background-00)',
			},
			accent: {
				'00': 'var(--accent-00)',
			},
		},
	},
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
