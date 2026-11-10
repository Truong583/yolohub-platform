// ✨ Simplified SEO Configuration - Only Essential Fields
export const SEO_CONFIG = {
	// 🏠 Core Site Information
	siteName: "YoloHub",
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://yolohub.com",
	defaultTitle: "YoloHub - Learn Skills That Matter",
	defaultDescription:
		"Advance your career with practical courses designed by industry experts. Learn at your own pace, earn certificates, and join thousands of professionals building valuable skills.",

	// 👤 Business Basics
	business: {
		name: "YoloHub",
		foundedYear: 2020,
		email: "support@yolohub.com",
	},

	// 📱 Social Media (for structured data & sharing)
	social: {
		twitter: "@yolohub",
		facebook: "yolohub",
		instagram: "yolohub",
		linkedin: "company/yolohub",
		youtube: "@yolohub",
	},

	// 🔍 SEO Basics
	keywords: [
		"online learning",
		"education platform",
		"online courses",
		"skill development",
		"professional development",
		"e-learning",
		"LMS",
	],

	// 🌐 OpenGraph (for social sharing)
	openGraph: {
		defaultImage: "/images/og-default.jpg", // 1200x630px
		imageAlt: "YoloHub - Learn Skills That Matter",
	},

	// 🐦 Twitter Card
	twitter: {
		handle: "@yolohub",
	},

	// ✅ Verification (add when you have them)
	verification: {
		google: "", // Add your Google Search Console verification code
		// bing: "", // Uncomment when needed
	},
};

// 📄 Page-Specific SEO (simplified)
export const PAGE_SEO = {
	home: {
		title: "Learn Skills That Matter | Online Education Platform", // Only used for OpenGraph
		description:
			"Master in-demand skills with expert-led courses. Interactive learning, real-world projects, and professional certificates. Start building your future today with flexible online education.",
	},

	about: {
		title: "About - Building the Future of Education", // Will become "About - Building the Future of Education | YoloHub"
		description:
			"Discover how YoloHub is making quality education accessible to everyone. Our story, mission, and commitment to empowering learners worldwide since 2020.",
	},

	courses: {
		title: "Online Courses - Learn from Expert Instructors", // Will become "Online Courses - Learn from Expert Instructors | YoloHub"
		description:
			"Browse hundreds of courses across technology, business, design, and more. Expert instructors, hands-on projects, and certificates to advance your career.",
	},

	blog: {
		title: "Education Blog - Learning Tips & Industry Insights", // Will become "Education Blog - Learning Tips & Industry Insights | YoloHub"
		description:
			"Stay ahead with learning strategies, industry trends, and expert insights. Practical tips to accelerate your professional growth and skill development.",
	},

	contact: {
		title: "Contact - Get Support & Connect with Us", // Will become "Contact - Get Support & Connect with Us | YoloHub"
		description:
			"Need help with your learning journey? Get in touch with our support team. We're here to help you succeed and make the most of your educational experience.",
	},
};

// 🎯 Templates for Dynamic Pages
export const SEO_TEMPLATES = {
	course: {
		title: "%s - Online Course | YoloHub",
		description:
			"Learn %s with our comprehensive online course. Expert instruction, practical projects, and certification upon completion.",
	},
	blog: {
		title: "%s | YoloHub Education Blog",
		description:
			"Read about %s and discover expert insights on education, learning strategies, and professional development from YoloHub.",
	},
};

// 🏗️ Structured Data Templates (JSON-LD)
export const STRUCTURED_DATA = {
	organization: {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		name: SEO_CONFIG.business.name,
		url: SEO_CONFIG.siteUrl,
		logo: `${SEO_CONFIG.siteUrl}/images/logo.png`,
		foundingDate: SEO_CONFIG.business.foundedYear.toString(),
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: SEO_CONFIG.business.email,
		},
		sameAs: [
			`https://twitter.com/${SEO_CONFIG.social.twitter.replace("@", "")}`,
			`https://facebook.com/${SEO_CONFIG.social.facebook}`,
			`https://instagram.com/${SEO_CONFIG.social.instagram}`,
			`https://linkedin.com/${SEO_CONFIG.social.linkedin}`,
			`https://youtube.com/${SEO_CONFIG.social.youtube}`,
		],
	},

	website: {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SEO_CONFIG.siteName,
		url: SEO_CONFIG.siteUrl,
		potentialAction: {
			"@type": "SearchAction",
			target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	},

	// 📚 Course Schema Template
	course: (course: {
		title: string;
		description: string;
		slug: string;
		thumbnail?: string;
		instructor?: {name: string};
		price?: number;
		rating?: number;
	}) => ({
		"@context": "https://schema.org",
		"@type": "Course",
		name: course.title,
		description: course.description,
		provider: {
			"@type": "EducationalOrganization",
			name: SEO_CONFIG.business.name,
			url: SEO_CONFIG.siteUrl,
		},
		instructor: course.instructor
			? {
					"@type": "Person",
					name: course.instructor.name,
			  }
			: undefined,
		image: course.thumbnail,
		offers: course.price
			? {
					"@type": "Offer",
					price: course.price,
					priceCurrency: "USD",
			  }
			: undefined,
		aggregateRating: course.rating
			? {
					"@type": "AggregateRating",
					ratingValue: course.rating,
			  }
			: undefined,
	}),

	// 📝 Blog Post Schema Template
	blogPost: (blog: {
		title: string;
		description: string;
		slug: string;
		thumbnail?: string;
		author?: {name: string};
		createdAt: string;
	}) => ({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.title,
		description: blog.description,
		image: blog.thumbnail,
		author: {
			"@type": "Person",
			name: blog.author?.name || SEO_CONFIG.business.name,
		},
		publisher: {
			"@type": "Organization",
			name: SEO_CONFIG.business.name,
			logo: {
				"@type": "ImageObject",
				url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
			},
		},
		datePublished: blog.createdAt,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${SEO_CONFIG.siteUrl}/blogs/${blog.slug}`,
		},
	}),

	// 🍞 Breadcrumb Schema
	breadcrumbs: (items: Array<{name: string; url: string}>) => ({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	}),

	// ❓ FAQ Schema Template
	faq: (faqs: Array<{question: string; answer: string}>) => ({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	}),
};

// 🚀 Export aliases for backwards compatibility
export const SCHEMA_ORG = STRUCTURED_DATA; // Keep old name working
export const COURSE_SEO_TEMPLATE = SEO_TEMPLATES.course;
export const BLOG_SEO_TEMPLATE = SEO_TEMPLATES.blog;
