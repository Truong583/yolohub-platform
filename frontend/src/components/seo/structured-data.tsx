import Script from "next/script";

interface StructuredDataProps {
	data: object | object[];
}

export function StructuredData({data}: StructuredDataProps) {
	const structuredData = Array.isArray(data) ? data : [data];

	return (
		<>
			{structuredData.map((item, index) => (
				<Script
					key={index}
					id={`structured-data-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(item, null, 0),
					}}
				/>
			))}
		</>
	);
}

// Convenience components for common structured data
export function OrganizationStructuredData() {
	return (
		<StructuredData
			data={import("@/configs/seo").then((m) => m.STRUCTURED_DATA.organization)}
		/>
	);
}

export function WebsiteStructuredData() {
	return (
		<StructuredData
			data={import("@/configs/seo").then((m) => m.STRUCTURED_DATA.website)}
		/>
	);
}

interface BreadcrumbStructuredDataProps {
	items: Array<{name: string; url: string}>;
}

export function BreadcrumbStructuredData({
	items,
}: BreadcrumbStructuredDataProps) {
	const data = import("@/configs/seo").then((m) =>
		m.STRUCTURED_DATA.breadcrumbs(items)
	);
	return <StructuredData data={data} />;
}

interface CourseStructuredDataProps {
	course: {
		title: string;
		description: string;
		slug: string;
		thumbnail?: string;
		instructor?: {name: string};
		price?: number;
		rating?: number;
	};
}

export function CourseStructuredData({course}: CourseStructuredDataProps) {
	const data = import("@/configs/seo").then((m) =>
		m.STRUCTURED_DATA.course(course)
	);
	return <StructuredData data={data} />;
}

interface BlogStructuredDataProps {
	blog: {
		title: string;
		description: string;
		slug: string;
		thumbnail?: string;
		author?: {name: string};
		createdAt: string;
	};
}

export function BlogStructuredData({blog}: BlogStructuredDataProps) {
	const data = import("@/configs/seo").then((m) =>
		m.STRUCTURED_DATA.blogPost(blog)
	);
	return <StructuredData data={data} />;
}

interface FAQStructuredDataProps {
	faqs: Array<{question: string; answer: string}>;
}

export function FAQStructuredData({faqs}: FAQStructuredDataProps) {
	const data = import("@/configs/seo").then((m) => m.STRUCTURED_DATA.faq(faqs));
	return <StructuredData data={data} />;
}
