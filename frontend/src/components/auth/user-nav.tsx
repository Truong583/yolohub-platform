"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SYSTEM_ROLE_NAMES} from "@/configs/permission";
import {ROUTE_CONFIG} from "@/configs/routes";
import {DEFAULT_AVATAR} from "@/constants";
import {useAuthStore, useIsAuthenticated, useUser} from "@/stores/auth-store";
import {LogOut, Settings, ShieldCheck, User} from "lucide-react";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {GoPackage} from "react-icons/go";
export function UserNav() {
	const user = useUser();
	const isAuthenticated = useIsAuthenticated();
	const {data: session} = useSession();

	const {logout} = useAuthStore();
	const router = useRouter();

	if (!isAuthenticated || !user) {
		return null;
	}
	// Check if user has admin or superadmin role
	const isAdminUser =
		user?.roles?.some(
			(role) =>
				role.name === SYSTEM_ROLE_NAMES.ADMIN ||
				role.name === SYSTEM_ROLE_NAMES.SUPER_ADMIN
		) || false;
	const handleLogout = async () => {
		if (
			session &&
			(session.provider === "google" || session.provider === "facebook")
		) {
			await signOut({redirect: false});
		}
		await logout();
		router.push(ROUTE_CONFIG.HOME);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="h-10 w-10 relative cursor-pointer">
					<Avatar className="w-full h-full ring-2 ring-white/50 shadow-lg  transition-all duration-200">
						<AvatarImage
							src={user.avatar || DEFAULT_AVATAR}
							alt={user.username || "User"}
						/>
						<AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-bold">
							{user.username ? user.username.slice(0, 2).toUpperCase() : "U"}
						</AvatarFallback>
					</Avatar>
					{/* Online indicator */}
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{/* User Profile Header */}
				<div className="px-4 pt-4">
					<div className="flex items-center space-x-3">
						<div className="h-12 w-12 relative">
							<Avatar className="w-full h-full ring-4 ring-white/50 shadow-lg">
								<AvatarImage
									src={user.avatar || DEFAULT_AVATAR}
									alt={user.username || "User"}
								/>
								<AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold">
									{user.username
										? user.username.slice(0, 2).toUpperCase()
										: "U"}
								</AvatarFallback>
							</Avatar>
							{/* Online indicator */}
							<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-lg text-gray-900">
								{user.username}
							</h3>
							<p className="text-gray-600 text-sm">{user.email}</p>
						</div>
					</div>
				</div>

				{/* Menu Items */}
				<div className="p-2">
					{isAdminUser && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									href={ROUTE_CONFIG.ADMIN.DASHBOARD}
									className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer"
								>
									<ShieldCheck className="h-4 w-4 text-gray-600" />
									<span>Admin Dashboard</span>
								</Link>
							</DropdownMenuItem>
						</>
					)}
					<DropdownMenuItem asChild>
						<Link
							href={ROUTE_CONFIG.PROFILE.MY_PROFILE}
							className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer"
						>
							<User className="h-4 w-4 text-gray-600" />
							<span>My Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href={ROUTE_CONFIG.PROFILE.MY_ORDERS}
							className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer"
						>
							<GoPackage className="h-4 w-4 text-gray-600" />
							<span>My Orders</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link
							href={ROUTE_CONFIG.PROFILE.SETTINGS}
							className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer"
						>
							<Settings className="h-4 w-4 text-gray-600" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={handleLogout}
						className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50"
					>
						<LogOut className="h-4 w-4" />
						<span>Sign Out</span>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
