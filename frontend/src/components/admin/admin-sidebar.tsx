"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	MdDashboard,
	MdPeople,
	MdSchool,
	MdCategory,
	MdSecurity,
	MdSettings,
	MdLogout,
	MdLocalOffer,
	MdShoppingCart,
	MdArticle,
	MdComment,
} from "react-icons/md";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useUser, useAuthStore} from "@/stores/auth-store";
import {signOut, useSession} from "next-auth/react";
import {ROUTE_CONFIG} from "@/configs/routes";

const menuItems = [
	{
		title: "Dashboard",
		url: "/admin/dashboard",
		icon: MdDashboard,
	},
	{
		title: "Users",
		url: "/admin/users",
		icon: MdPeople,
	},
	{
		title: "Courses",
		url: "/admin/courses",
		icon: MdSchool,
	},
	{
		title: "Categories",
		url: "/admin/categories",
		icon: MdCategory,
	},
	{
		title: "Blogs",
		url: "/admin/blogs",
		icon: MdArticle,
	},
	{
		title: "Comments",
		url: "/admin/comments",
		icon: MdComment,
	},
	{
		title: "Coupons",
		url: "/admin/coupons",
		icon: MdLocalOffer,
	},
	{
		title: "Orders",
		url: "/admin/orders",
		icon: MdShoppingCart,
	},
	{
		title: "Roles",
		url: "/admin/roles",
		icon: MdSecurity,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const user = useUser();
	const {data: session} = useSession();
	const {logout} = useAuthStore();

	const handleLogout = async () => {
		if (
			session &&
			(session?.provider === "google" || session?.provider === "facebook")
		) {
			await signOut({redirect: false});
		}
		await logout();
		router.push("/auth/sign-in");
	};

	// Generate initials from username
	const initials = user?.username?.slice(0, 2).toUpperCase() || "AD";

	return (
		<Sidebar className="border-r">
			<SidebarHeader className="p-6 border-b shrink-0">
				<Link
					href={ROUTE_CONFIG.HOME}
					className="flex items-center gap-3 min-w-0"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
						<MdSchool className="h-4 w-4" />
					</div>
					<h2 className="text-lg font-semibold truncate">LMS Admin</h2>
				</Link>
			</SidebarHeader>

			<SidebarContent className="flex-1 px-4 py-4 min-h-0 overflow-x-hidden">
				<SidebarMenu>
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={pathname === item.url}>
								<Link
									href={item.url}
									className="flex items-center gap-3 px-3 py-2 min-w-0"
								>
									<item.icon className="h-4 w-4 shrink-0" />
									<span className="truncate">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>

				<SidebarSeparator className="my-4" />

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link
								href="/admin/settings"
								className="flex items-center gap-3 px-3 py-2 min-w-0"
							>
								<MdSettings className="h-4 w-4 shrink-0" />
								<span className="truncate">Settings</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="p-4 border-t shrink-0">
				<div className="flex items-center gap-3 min-w-0">
					<Avatar className="h-8 w-8 shrink-0">
						<AvatarImage src="/avatar.jpg" alt={user?.username} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">{user?.username}</p>
						<p className="text-xs text-muted-foreground truncate">
							{user?.email}
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="text-muted-foreground hover:text-foreground"
						title="Logout"
					>
						<MdLogout className="h-4 w-4" />
					</button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
