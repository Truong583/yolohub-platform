"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Play} from "lucide-react";

function VideoDemoSection() {
	return (
		<section className="py-12 md:py-16 bg-muted/30" id="video-demo">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4 gap-2" variant="outline">
						<Play className="h-3 w-3" />
						Video Demo
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						Xem Demo Trực Tiếp
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Khám phá nền tảng YoloHub trong hành động - từ giao diện người dùng
						đến các tính năng nâng cao
					</p>
				</div>

				<div className="mx-auto max-w-5xl">
					<Card className="overflow-hidden border-2 shadow-2xl">
						<CardContent className="p-0">
							{/* Responsive video container with 16:9 aspect ratio */}
							<div className="relative aspect-video w-full">
								<iframe
									className="absolute inset-0 h-full w-full"
									src="https://www.youtube.com/embed/B1UvPId3hxY"
									title="YoloHub LMS Platform Demo"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
								/>
							</div>
						</CardContent>
					</Card>

					{/* Video highlights */}
					<div className="mt-8 grid gap-4 md:grid-cols-3">
						<div className="rounded-lg border bg-card p-4 text-center">
							<div className="mb-2 text-2xl font-bold text-primary">🎨</div>
							<div className="text-sm font-medium">Modern UI/UX</div>
							<div className="text-xs text-muted-foreground">
								Shadcn UI & Tailwind CSS
							</div>
						</div>
						<div className="rounded-lg border bg-card p-4 text-center">
							<div className="mb-2 text-2xl font-bold text-primary">⚡</div>
							<div className="text-sm font-medium">Realtime Features</div>
							<div className="text-xs text-muted-foreground">
								Socket.IO & AI Chatbot
							</div>
						</div>
						<div className="rounded-lg border bg-card p-4 text-center">
							<div className="mb-2 text-2xl font-bold text-primary">🚀</div>
							<div className="text-sm font-medium">Production Ready</div>
							<div className="text-xs text-muted-foreground">
								Full-stack deployment
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default VideoDemoSection;
