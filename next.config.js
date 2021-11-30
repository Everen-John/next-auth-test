const withPWA = require("next-pwa")

module.exports = withPWA({
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
	},
	reactStrictMode: true,
	webpack: (config) => {
		config.experiments = { topLevelAwait: true }
		return config
	},
	images: {
		domains: ["via.placeholder.com", "lh3.googleusercontent.com"],
	},
})
