module.exports = {
	reactStrictMode: true,
	webpack: (config) => {
		config.experiments = { topLevelAwait: true }
		return config
	},
	images: {
		domains: ["via.placeholder.com", "lh3.googleusercontent.com"],
	},
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/:path*",
	// 			destination: "https://s3.ap-southeast-1.amazonaws.com/next-eren",
	// 		},
	// 	]
	// },
}
