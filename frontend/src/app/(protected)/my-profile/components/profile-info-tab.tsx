"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {useAuthStore} from "@/stores/auth-store";
import {useState} from "react";
import {
	MdAccountCircle,
	MdEdit,
	MdEmail,
	MdPerson,
	MdSecurity,
} from "react-icons/md";
import ProfileEditDialog from "./profile-edit-dialog";
import {DEFAULT_AVATAR} from "@/constants";

// Profile info tab component - Arrow function
const ProfileInfoTab = () => {
	const user = useAuthStore((state) => state.user);
	const [profileDialogOpen, setProfileDialogOpen] = useState(false);

	if (!user) return null;

	const avatarUrl = user.avatar || DEFAULT_AVATAR;
	const userInitials = user.username
		? user.username.slice(0, 2).toUpperCase()
		: "U";

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
					Personal Information
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage your account information and personal settings
				</p>
			</div>

			{/* Personal Information */}
			<Card className="max-w-3xl">
				<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
					<div>
						<CardDescription className="text-xs sm:text-sm">
							Basic account information
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setProfileDialogOpen(true)}
						className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
					>
						<MdEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						Edit
					</Button>
				</CardHeader>
				<CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
					{/* Avatar Section */}
					<div className="flex items-center gap-3 sm:gap-4">
						<Avatar className="h-16 w-16 sm:h-20 sm:w-20">
							{avatarUrl && (
								<AvatarImage src={avatarUrl} alt={user.username || "User"} />
							)}
							<AvatarFallback className="bg-primary text-primary-foreground text-base sm:text-lg">
								{userInitials}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm sm:text-base truncate">
								{user.username}
							</h3>
							<p className="text-xs sm:text-sm text-muted-foreground">
								Profile Picture
							</p>
						</div>
					</div>

					<Separator />

					{/* User Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-start gap-2 sm:gap-3">
								<MdPerson className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
								<div className="min-w-0 flex-1">
									<p className="text-xs sm:text-sm font-medium">Username</p>
									<p className="text-xs sm:text-sm text-muted-foreground truncate">
										{user.username}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2 sm:gap-3">
								<MdEmail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
								<div className="min-w-0 flex-1">
									<p className="text-xs sm:text-sm font-medium">Email</p>
									<p className="text-xs sm:text-sm text-muted-foreground truncate">
										{user.email}
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-start gap-2 sm:gap-3">
								<MdAccountCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-xs sm:text-sm font-medium">Account Type</p>
									<Badge
										variant="secondary"
										className="mt-1 text-[10px] sm:text-xs"
									>
										{user.userType === "default"
											? "Regular Account"
											: user.userType === "google"
											? "Google"
											: "Facebook"}
									</Badge>
								</div>
							</div>

							<div className="flex items-start gap-2 sm:gap-3">
								<MdSecurity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-xs sm:text-sm font-medium">Status</p>
									<Badge
										variant={
											user.status === "active" ? "default" : "destructive"
										}
										className="mt-1 text-[10px] sm:text-xs"
									>
										{user.status === "active"
											? "Active"
											: user.status === "inactive"
											? "Inactive"
											: "Banned"}
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Dialog Components */}
			<ProfileEditDialog
				open={profileDialogOpen}
				onOpenChange={setProfileDialogOpen}
				user={user}
			/>
		</div>
	);
};

export default ProfileInfoTab;
