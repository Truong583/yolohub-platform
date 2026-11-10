"use client";

import {Button} from "@/components/ui/button";
import {ArrowRight, Github, Heart} from "lucide-react";

function CTASection() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 md:py-16">
			{/* Animated background */}
			<div className="absolute inset-0 -z-10 opacity-20">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
			</div>

			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
						Sẵn sàng khám phá?
					</h2>
					<p className="mb-8 text-lg text-muted-foreground md:text-xl">
						Trải nghiệm nền tảng LMS hiện đại với đầy đủ tính năng
						production-ready.
						<br />
						Nếu bạn thấy hữu ích, hãy để lại một ⭐ trên GitHub!
					</p>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" className="gap-2 px-8" asChild>
							<a
								href="https://yolohub.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
							>
								Xem Demo V2
								<ArrowRight className="h-4 w-4" />
							</a>
						</Button>
						<Button size="lg" variant="outline" className="gap-2 px-8" asChild>
							<a
								href="https://github.com/tinphancr7"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4" />
								View on GitHub
							</a>
						</Button>
					</div>

					{/* Support Message */}
					<div className="mt-12 rounded-xl border bg-card p-6 shadow-lg">
						<div className="mb-3 flex items-center justify-center gap-2 text-lg font-semibold">
							<Heart className="h-5 w-5 fill-red-500 text-red-500" />
							Hỗ trợ dự án
						</div>
						<p className="text-sm text-muted-foreground">
							Nếu bạn thấy dự án này hữu ích, đừng quên để lại một comment, like
							và ⭐ star trên GitHub để ủng hộ mình nhé! Cảm ơn các bạn rất
							nhiều!
						</p>
					</div>

					{/* Tech Badges */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<img
							src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js"
							alt="Next.js"
							className="h-7"
						/>
						<img
							src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"
							alt="NestJS"
							className="h-7"
						/>
						<img
							src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"
							alt="MongoDB"
							className="h-7"
						/>
						<img
							src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"
							alt="TypeScript"
							className="h-7"
						/>
						<img
							src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"
							alt="Tailwind"
							className="h-7"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export default CTASection;
