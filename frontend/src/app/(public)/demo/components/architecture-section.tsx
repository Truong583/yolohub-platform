"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Layers, TrendingUp, Zap} from "lucide-react";

function ArchitectureSection() {
	return (
		<section className="py-12 md:py-16" id="architecture">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4" variant="outline">
						Kiến trúc
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						Kiến Trúc Hệ Thống
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Được thiết kế với tư duy microservices, dễ dàng mở rộng và bảo trì
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Frontend Architecture */}
					<Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
						<CardHeader>
							<div className="mb-2 flex items-center gap-2">
								<div className="rounded-lg bg-blue-500/10 p-2">
									<Layers className="h-5 w-5 text-blue-500" />
								</div>
								<CardTitle className="text-xl">Frontend Layer</CardTitle>
							</div>
							<CardDescription>
								Next.js 15 App Router với rendering tối ưu
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<Zap className="h-4 w-4 text-blue-500" />
									Rendering Strategy
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• SSR cho SEO pages</li>
									<li>• CSR cho interactive components</li>
									<li>• ISR cho dynamic content</li>
									<li>• Code splitting & lazy loading</li>
								</ul>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<TrendingUp className="h-4 w-4 text-blue-500" />
									State Management
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• Zustand cho UI state</li>
									<li>• React Query cho server state</li>
									<li>• Redux Toolkit cho global state</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					{/* Backend Architecture */}
					<Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
						<CardHeader>
							<div className="mb-2 flex items-center gap-2">
								<div className="rounded-lg bg-green-500/10 p-2">
									<Layers className="h-5 w-5 text-green-500" />
								</div>
								<CardTitle className="text-xl">Backend Layer</CardTitle>
							</div>
							<CardDescription>
								NestJS với kiến trúc module-based
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<Zap className="h-4 w-4 text-green-500" />
									API Architecture
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• RESTful API design</li>
									<li>• GraphQL cho complex queries</li>
									<li>• Socket.IO cho realtime</li>
									<li>• Bull Queue cho async tasks</li>
								</ul>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<TrendingUp className="h-4 w-4 text-green-500" />
									Performance
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• Redis caching layer</li>
									<li>• Database indexing</li>
									<li>• Query optimization</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					{/* Infrastructure */}
					<Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
						<CardHeader>
							<div className="mb-2 flex items-center gap-2">
								<div className="rounded-lg bg-purple-500/10 p-2">
									<Layers className="h-5 w-5 text-purple-500" />
								</div>
								<CardTitle className="text-xl">Infrastructure</CardTitle>
							</div>
							<CardDescription>
								DevOps và deployment tự động hoá
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<Zap className="h-4 w-4 text-purple-500" />
									CI/CD Pipeline
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• GitHub Actions automation</li>
									<li>• Docker containerization</li>
									<li>• Automated testing</li>
									<li>• Zero-downtime deployment</li>
								</ul>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium">
									<TrendingUp className="h-4 w-4 text-purple-500" />
									Scalability
								</div>
								<ul className="ml-6 space-y-1 text-sm text-muted-foreground">
									<li>• Load balancing với Nginx</li>
									<li>• CDN với Cloudflare</li>
									<li>• Horizontal scaling ready</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Flow Diagram */}
				<div className="mt-8">
					<Card className="overflow-hidden">
						<CardHeader className="text-center">
							<CardTitle>Data Flow</CardTitle>
							<CardDescription>
								Luồng dữ liệu từ client đến server
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap items-center justify-center gap-4 py-6">
								<Badge variant="secondary" className="px-4 py-2">
									Client
								</Badge>
								<ArrowRight className="h-4 w-4 text-muted-foreground" />
								<Badge variant="secondary" className="px-4 py-2">
									Next.js API Routes
								</Badge>
								<ArrowRight className="h-4 w-4 text-muted-foreground" />
								<Badge variant="secondary" className="px-4 py-2">
									NestJS Backend
								</Badge>
								<ArrowRight className="h-4 w-4 text-muted-foreground" />
								<Badge variant="secondary" className="px-4 py-2">
									Redis Cache
								</Badge>
								<ArrowRight className="h-4 w-4 text-muted-foreground" />
								<Badge variant="secondary" className="px-4 py-2">
									MongoDB
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default ArchitectureSection;
