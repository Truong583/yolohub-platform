"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ROUTE_CONFIG} from "@/configs/routes";
import {DEFAULT_AVATAR} from "@/constants";
import {useAuthStore} from "@/stores/auth-store";
import {useRouter} from "next/navigation";
import {
	MdArticle,
	MdLogout,
	MdPerson,
	MdSchool,
	MdSettings,
} from "react-icons/md";

export type ProfileTab = "account" | "courses" | "posts" | "settings";

interface ProfileSidebarProps {
	activeTab: ProfileTab;
	onTabChange: (tab: ProfileTab) => void;
}

const sidebarItems = [
	{
		id: "account" as ProfileTab,
		label: "Account",
		icon: MdPerson,
	},
	{
		id: "courses" as ProfileTab,
		label: "My Courses",
		icon: MdSchool,
	},
	{
		id: "posts" as ProfileTab,
		label: "My Posts",
		icon: MdArticle,
	},
	{
		id: "settings" as ProfileTab,
		label: "Settings",
		icon: MdSettings,
	},
];

// Profile sidebar component - Arrow function
const ProfileSidebar = ({activeTab, onTabChange}: ProfileSidebarProps) => {
	const {user, logout} = useAuthStore();
	const router = useRouter();

	// Handle logout - Arrow function
	const handleLogout = () => {
		logout();
		router.push(ROUTE_CONFIG.AUTH.SIGN_IN);
	};

	if (!user) return null;

	const avatarUrl = user.avatar || DEFAULT_AVATAR;
	const userInitials = user.username
		? user.username.slice(0, 2).toUpperCase()
		: "U";

	return (
		<>
			{/* Desktop Sidebar */}
			<Card className="hidden lg:block h-fit pt-0 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
				<CardContent className="p-0">
					{/* User Profile Header */}
					<div className="p-6 flex flex-col items-center gap-2 justify-center bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
						<div className="relative">
							<div className="h-20 w-20 relative">
								<Avatar className="w-full h-full mx-auto mb-4 ring-4 ring-white/50 shadow-lg">
									<AvatarImage src={avatarUrl} alt={user.username} />
									<AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold">
										{userInitials}
									</AvatarFallback>
								</Avatar>
								{/* Online indicator */}
								<div className="absolute bottom-2 right-0 size-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
							</div>
						</div>
						<h3 className="font-bold text-lg text-gray-900 dark:text-white">
							{user.username}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							{user.email}
						</p>
					</div>

					<Separator className="border-gray-200 dark:border-gray-700" />

					{/* Navigation Items */}
					<div className="p-3">
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;

							return (
								<Button
									key={item.id}
									variant="ghost"
									className={`w-full justify-start mb-2 h-12 transition-all duration-200 font-medium ${
										isActive
											? "bg-gradient-to-r from-primary to-primary/90 text-white hover:text-white shadow-md hover:shadow-lg transform scale-[1.02]"
											: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
									}`}
									onClick={() => onTabChange(item.id)}
								>
									<Icon
										className={`h-5 w-5 mr-3 ${isActive ? "text-white" : ""}`}
									/>
									{item.label}
								</Button>
							);
						})}

						<Separator className="my-4 border-gray-200 dark:border-gray-700" />

						{/* Logout Button */}
						<Button
							variant="ghost"
							className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-12 font-medium transition-all duration-200"
							onClick={handleLogout}
						>
							<MdLogout className="h-5 w-5 mr-3" />
							Logout
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Mobile Navigation */}
			<div className="lg:hidden space-y-3 sm:space-y-4">
				{/* User Profile Card - Mobile */}
				<Card className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="relative">
								<Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-white/50 shadow-md">
									<AvatarImage src={avatarUrl} alt={user.username} />
									<AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm sm:text-base font-bold">
										{userInitials}
									</AvatarFallback>
								</Avatar>
								{/* Online indicator */}
								<div className="absolute bottom-0 right-0 size-2.5 sm:size-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">
									{user.username}
								</h3>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
									{user.email}
								</p>
							</div>
							{/* Logout Button - Mobile */}
							<Button
								variant="ghost"
								size="sm"
								className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
								onClick={handleLogout}
							>
								<MdLogout className="h-4 w-4 sm:h-5 sm:w-5" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Horizontal Tabs - Mobile */}
				<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;

						return (
							<Button
								key={item.id}
								variant={isActive ? "default" : "outline"}
								size="sm"
								className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 ${
									isActive
										? "bg-gradient-to-r from-primary to-primary/90 shadow-md"
										: "hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
								onClick={() => onTabChange(item.id)}
							>
								<Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span className="whitespace-nowrap">{item.label}</span>
							</Button>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default ProfileSidebar;
