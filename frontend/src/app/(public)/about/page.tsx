import {generateAboutMetadata} from "@/components/seo";
import dynamic from "next/dynamic";

// SEO Metadata for About Page
export const metadata = generateAboutMetadata();

// Static import for above-the-fold critical content
import HeroSection from "./components/hero-section";

// Dynamic imports for below-the-fold SEO content
const StatsSection = dynamic(() => import("./components/stats-section"));
const MissionSection = dynamic(() => import("./components/mission-section"));
const TeamSection = dynamic(() => import("./components/team-section"));
const CallToActionSection = dynamic(() => import("./components/cta-section"));

// About page - Arrow function
const AboutPage = () => {
	return (
		<>
			<HeroSection />
			<StatsSection />
			<MissionSection />
			<TeamSection />
			<CallToActionSection />
		</>
	);
};

export default AboutPage;
