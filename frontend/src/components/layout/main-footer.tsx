import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
	BookOpen,
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import Link from "next/link";
import {FaTelegram} from "react-icons/fa6";

const MainFooter = () => {
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{name: "About Us", href: "/about"},
		{name: "Courses", href: "/courses"},
		{name: "Instructors", href: "/instructors"},
		{name: "Contact", href: "/contact"},
	];

	const supportLinks = [
		{name: "Help Center", href: "/help"},
		{name: "Terms of Service", href: "/terms"},
		{name: "Privacy Policy", href: "/privacy"},
		{name: "Refund Policy", href: "/refund"},
	];

	const socialLinks = [
		{
			name: "Facebook",
			href: "https://www.facebook.com/yolo7dev/",
			icon: Facebook,
		},
		{name: "Telegram", href: "https://t.me/yolo7dev", icon: FaTelegram},
		{
			name: "Instagram",
			href: "https://www.instagram.com/yolo7dev/",
			icon: Instagram,
		},
		{
			name: "LinkedIn",
			href: "https://www.linkedin.com/in/tin-phan-thanh-880684275/",
			icon: Linkedin,
		},
	];

	return (
		<footer className="bg-gray-50 border-t">
			<div className="container mx-auto px-6 py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center space-x-2">
							<BookOpen className="h-8 w-8 text-primary" />
							<span className="text-2xl font-bold">YoloHub</span>
						</Link>
						<p className="text-gray-600 max-w-sm">
							Transform your future with our comprehensive online courses. Learn
							from industry experts and advance your career.
						</p>
						<div className="flex space-x-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<Link
										key={social.name}
										href={social.href}
										className="text-gray-400 hover:text-primary transition-colors"
									>
										<Icon className="h-5 w-5" />
										<span className="sr-only">{social.name}</span>
									</Link>
								);
							})}
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Quick Links</h3>
						<ul className="space-y-2">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-gray-600 hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Support</h3>
						<ul className="space-y-2">
							{supportLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-gray-600 hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact & Newsletter */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Stay Connected</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-2 text-gray-600">
								<Mail className="h-4 w-4" />
								<span className="text-sm">support@yolohub.com</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<Phone className="h-4 w-4" />
								<span className="text-sm">+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<MapPin className="h-4 w-4" />
								<span className="text-sm">New York, NY</span>
							</div>
						</div>

						{/* Newsletter Signup */}
						<div className="space-y-2">
							<p className="text-sm text-gray-600">
								Subscribe to our newsletter
							</p>
							<div className="flex space-x-2">
								<Input
									type="email"
									placeholder="Enter your email"
									className="flex-1"
								/>
								<Button size="sm">Subscribe</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-500 text-sm">
						© {currentYear} YoloHub. All rights reserved.
					</p>
					<div className="flex items-center space-x-4 mt-4 md:mt-0">
						<Link
							href="/terms"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Terms
						</Link>
						<Link
							href="/privacy"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/cookies"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default MainFooter;
