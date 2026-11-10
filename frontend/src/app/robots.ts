import {SEO_CONFIG} from "@/configs/seo";
import {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin/",
					"/api/",
					"/learning/",
					"/my-profile/",
					"/cart/",
					"/qr-payment/",
					"/stripe-payment/",
					"/auth/",
					"/search?*",
					"/*?*",
				],
			},
			{
				userAgent: "*",
				allow: "/api/sitemap",
			},
		],
		sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
		host: SEO_CONFIG.siteUrl,
	};
}
