import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	output: "standalone",
	reactStrictMode: false,
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // allow all domains
			},
			{
				protocol: "http",
				hostname: "**", // if you also need http
			},
		],
	},
};

export default withBundleAnalyzer(nextConfig);
