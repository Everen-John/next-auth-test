module.exports = {
	reactStrictMode: true,
	webpack: (config) => {
		config.experiments = { topLevelAwait: true }
		config.experiments.layers = true
		return config
	},
	images: {
		domains: ["via.placeholder.com", "lh3.googleusercontent.com"],
	},
	// experimental: {
	// 	urlImports: ["https://cdn.jsdelivr.net"],
	// },

	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/:path*",
	// 			destination: "https://s3.ap-southeast-1.amazonaws.com/next-eren",
	// 		},
	// 	]
	// },
}
