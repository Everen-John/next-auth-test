module.exports = {
	important: true,
	purge: {
		content: [
			"./src/pages/**/*.{js,ts,jsx,tsx,html}",
			"./src/components/**/*.{js,ts,jsx,tsx,html}",
		],
		safelist: [/bg-red/, /bg-yellow/, /bg-green/],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontSize: {
			"2xs": ".65rem",
			"3xs": ".5rem",
			"4xs": ".25rem",
			"5xs": ".1rem",
			xs: ".75rem",
			sm: ".875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "4rem",
			"7xl": "5rem",
		},
		minWidth: {
			0: "0",
			"1/8": "12.5%",
			"1/4": "25%",
			"1/2": "50%",
			"3/4": "75%",
			"7/8": "87.5%",
			full: "100%",
		},
		maxWidth: {
			0: "0",
			"1/8": "12.5%",
			"1/4": "25%",
			"1/2": "50%",
			"3/4": "75%",
			full: "100%",
		},
		minHeight: {
			0: "0",
			"1/4": "25%",
			"1/2": "50%",
			"3/4": "75%",
			full: "100%",
			"30vh": "30vh",
			"40vh": "40vh",
			"50vh": "50vh",
			"60vh": "60vh",
			"70vh": "70vh",

			"80vh": "80vh",
			"50rem": "50rem",
			"80rem": "80rem",
		},
		extend: {
			animation: {
				"gradient-x": "gradient-x 6s ease infinite",
				"gradient-y": "gradient-y 6s ease infinite",
				"gradient-xy": "gradient-xy 6s ease infinite",
			},
			keyframes: {
				"gradient-y": {
					"0%, 100%": {
						"background-size": "400% 400%",
						"background-position": "center top",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "center center",
					},
				},
				"gradient-x": {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
				"gradient-xy": {
					"0%, 100%": {
						"background-size": "400% 400%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
