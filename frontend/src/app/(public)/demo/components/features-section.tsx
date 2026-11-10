"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
	Palette,
	Shield,
	MessageSquare,
	Brain,
	CreditCard,
	GraduationCap,
	Video,
	Cog,
} from "lucide-react";

interface Feature {
	icon: React.ComponentType<{className?: string}>;
	title: string;
	description: string;
	highlights: string[];
	color: string;
}

const features: Feature[] = [
	{
		icon: Palette,
		title: "UI & Kiến trúc hiện đại",
		description: "Giao diện đẹp mắt, trải nghiệm người dùng mượt mà",
		color: "text-blue-500 bg-blue-500/10",
		highlights: [
			"Thiết kế với shadcn/ui, Zustand, React Query",
			"Cấu trúc dự án chuẩn hoá, dễ maintain",
			"Tối ưu hiệu năng (SSR, lazy load, caching)",
			"SEO thân thiện với meta & sitemap động",
		],
	},
	{
		icon: Shield,
		title: "Auth & Bảo mật",
		description: "Hệ thống xác thực và phân quyền mạnh mẽ",
		color: "text-red-500 bg-red-500/10",
		highlights: [
			"Login OAuth2 (Google, Facebook)",
			"OTP & reset password qua email",
			"Access Token / Refresh Token",
			"RBAC động - phân quyền chi tiết",
		],
	},
	{
		icon: MessageSquare,
		title: "Tương tác Realtime",
		description: "Kết nối và tương tác trực tiếp với người dùng",
		color: "text-green-500 bg-green-500/10",
		highlights: [
			"Comment nhiều cấp (như Facebook)",
			"Notification realtime (Socket.IO)",
			"Telegram notification cho admin",
			"Live updates cho user và admin",
		],
	},
	{
		icon: Brain,
		title: "AI & Tự động hoá",
		description: "Trí tuệ nhân tạo và quy trình tự động",
		color: "text-purple-500 bg-purple-500/10",
		highlights: [
			"Chatbot AI (Gemini) tư vấn khóa học",
			"Hỗ trợ học viên 24/7",
			"Email automation (Bull Queue)",
			"Tự động gửi thông báo thanh toán",
		],
	},
	{
		icon: CreditCard,
		title: "Thanh toán & Khuyến mãi",
		description: "Hệ thống thanh toán đa dạng và linh hoạt",
		color: "text-yellow-500 bg-yellow-500/10",
		highlights: [
			"VietQR, Stripe, thanh toán thủ công",
			"Coupon code, flash sale",
			"Membership plan",
			"Dashboard doanh thu chi tiết",
		],
	},
	{
		icon: GraduationCap,
		title: "Quản lý khoá học",
		description: "Công cụ quản lý khoá học toàn diện",
		color: "text-cyan-500 bg-cyan-500/10",
		highlights: [
			"Tạo & quản lý khóa học (Instructor)",
			"Drag & Drop sắp xếp bài học",
			"Quiz & chấm điểm tự động",
			"Lưu tiến độ học, resume video",
		],
	},
	{
		icon: Video,
		title: "Video & Upload",
		description: "Xử lý video và upload file chuyên nghiệp",
		color: "text-pink-500 bg-pink-500/10",
		highlights: [
			"UploadThing + AWS S3 + MUX",
			"Upload video lớn (chunk upload)",
			"HLS streaming chất lượng cao",
			"Code editor trên web",
		],
	},
	{
		icon: Cog,
		title: "Backend & Hạ tầng",
		description: "Kiến trúc backend mạnh mẽ và có thể mở rộng",
		color: "text-orange-500 bg-orange-500/10",
		highlights: [
			"NestJS + Redis Cache",
			"CI/CD GitHub Action, Docker",
			"Deploy VPS (aapanel, PM2, Nginx)",
			"Scalable & High Availability",
		],
	},
];

function FeaturesSection() {
	return (
		<section className="bg-muted/30 py-12 md:py-16" id="features">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4" variant="outline">
						Tính năng
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						Tính Năng Nổi Bật
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Khám phá những tính năng mạnh mẽ giúp nền tảng của chúng tôi trở nên
						độc đáo
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<Card
								key={feature.title}
								className="group transition-all hover:shadow-lg"
							>
								<CardHeader>
									<div className={`mb-3 w-fit rounded-lg p-3 ${feature.color}`}>
										<Icon className="h-6 w-6" />
									</div>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
									<CardDescription className="text-sm">
										{feature.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{feature.highlights.map((highlight) => (
											<li
												key={highlight}
												className="flex items-start gap-2 text-sm"
											>
												<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
												<span className="text-muted-foreground">
													{highlight}
												</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
