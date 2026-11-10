import dynamic from "next/dynamic";
import type {Metadata} from "next";

// SEO Metadata for Demo Page
export const metadata: Metadata = {
	title: "Demo - LMS Fullstack Platform | MERN + NestJS + Next.js",
	description:
		"Khám phá nền tảng E-Learning hiện đại với Next.js 15, NestJS, AI Chatbot, thanh toán VietQR/Stripe, và nhiều tính năng realtime khác.",
	keywords: [
		"LMS platform",
		"E-Learning",
		"Next.js",
		"NestJS",
		"MERN Stack",
		"Online courses",
		"AI Chatbot",
	],
	openGraph: {
		title: "Demo - LMS Fullstack Platform",
		description:
			"Nền tảng học trực tuyến fullstack với công nghệ hiện đại nhất",
		type: "website",
	},
};

// Static import for hero section (above-the-fold)
import HeroSection from "./components/hero-section";

// Dynamic imports for below-the-fold content
const VideoDemoSection = dynamic(
	() => import("./components/video-demo-section")
);
const TechStackSection = dynamic(
	() => import("./components/tech-stack-section")
);
const FeaturesSection = dynamic(() => import("./components/features-section"));
const ArchitectureSection = dynamic(
	() => import("./components/architecture-section")
);
const VersionsSection = dynamic(() => import("./components/versions-section"));
const DemoLinksSection = dynamic(
	() => import("./components/demo-links-section")
);
const CTASection = dynamic(() => import("./components/cta-section"));

function DemoPage() {
	return (
		<div className="min-h-screen">
			<HeroSection />
			<VideoDemoSection />
			<TechStackSection />
			<FeaturesSection />
			<ArchitectureSection />
			<VersionsSection />
			<DemoLinksSection />
			<CTASection />
		</div>
	);
}

export default DemoPage;
