import dynamic from "next/dynamic";
import HeroSection from "./components/hero-section";

// Static import for critical above-the-fold content

const ContactInfoSection = dynamic(
	() => import("./components/contact-info-section")
);

export default function ContactPage() {
	return (
		<>
			{/* Critical above-the-fold content - loads immediately */}
			<HeroSection />

			{/* Below-the-fold content - progressive loading with SEO */}
			<ContactInfoSection />
		</>
	);
}
