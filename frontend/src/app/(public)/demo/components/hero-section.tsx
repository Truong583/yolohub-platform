"use client";

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ArrowRight, Sparkles, Code2, Zap} from "lucide-react";
import Link from "next/link";

function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-16 md:pt-20 md:pb-20">
			{/* Animated background */}
			<div className="absolute inset-0 -z-10 opacity-20">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
			</div>

			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					<div className="mb-6 flex justify-center">
						<Badge
							className="gap-2 px-4 py-2 text-sm font-medium"
							variant="outline"
						>
							<Sparkles className="h-4 w-4" />
							Version 2.0 - Production Ready
						</Badge>
					</div>

					{/* Main Heading */}
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Dự án LMS Fullstack
						<span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Từ A đến Z
						</span>
					</h1>

					{/* Subtitle */}
					<p className="mb-8 text-lg text-muted-foreground md:text-xl">
						Nền tảng E-Learning thực chiến với <strong>Fullstack Stack</strong>
						<br />
						Không chỉ học mà còn vận hành như một sản phẩm thương mại thực thụ
					</p>

					{/* Tech Highlights */}
					<div className="mb-10 flex flex-wrap items-center justify-center gap-4">
						<div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
							<Code2 className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium">Next.js 15</span>
						</div>
						<div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
							<Zap className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium">NestJS + MongoDB</span>
						</div>
						<div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium">AI Chatbot</span>
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" className="gap-2" asChild>
							<Link href="#demo-links">
								Xem Demo Trực Tiếp
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="#features">Khám Phá Tính Năng</Link>
						</Button>
					</div>

					{/* Stats */}
					<div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="rounded-lg border bg-card p-4">
							<div className="text-3xl font-bold text-primary">3</div>
							<div className="text-sm text-muted-foreground">Phiên bản</div>
						</div>
						<div className="rounded-lg border bg-card p-4">
							<div className="text-3xl font-bold text-primary">50+</div>
							<div className="text-sm text-muted-foreground">Tính năng</div>
						</div>
						<div className="rounded-lg border bg-card p-4">
							<div className="text-3xl font-bold text-primary">10+</div>
							<div className="text-sm text-muted-foreground">Công nghệ</div>
						</div>
						<div className="rounded-lg border bg-card p-4">
							<div className="text-3xl font-bold text-primary">100%</div>
							<div className="text-sm text-muted-foreground">Production</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default HeroSection;
