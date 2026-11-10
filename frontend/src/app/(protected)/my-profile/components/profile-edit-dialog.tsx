"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent} from "@/components/ui/card";
import {toast} from "sonner";
import {useAuthStore} from "@/stores/auth-store";
import {AuthService, CurrentUser, UpdateProfileRequest} from "@/services/auth";
import {UploadButton} from "@/utils/uploadthing";
import {MdDelete} from "react-icons/md";
import {DEFAULT_AVATAR} from "@/constants";

// Validation schema for profile edit
const profileSchema = yup.object({
	username: yup
		.string()
		.required("Username is required")
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must not exceed 50 characters")
		.trim(),
	email: yup
		.string()
		.required("Email is required")
		.email("Please enter a valid email address")
		.trim(),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

// UploadThing response type
interface UploadResponse {
	url: string;
	key: string;
	name: string;
	size: number;
}

interface ProfileEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: CurrentUser;
}

// Profile edit dialog component - Arrow function
const ProfileEditDialog = ({
	open,
	onOpenChange,
	user,
}: ProfileEditDialogProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string>("");
	const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
	const {getCurrentUser} = useAuthStore();

	const form = useForm<ProfileFormData>({
		resolver: yupResolver(profileSchema),
		defaultValues: {
			username: user.username || "",
			email: user.email || "",
		},
	});

	const handleAvatarUploadComplete = (res: UploadResponse[]) => {
		if (res?.[0]?.url) {
			setAvatarUrl(res[0].url);
			toast.success("Avatar uploaded successfully!");
		}
	};

	const handleAvatarUploadError = (error: Error) => {
		console.error("Avatar upload error:", error);
		toast.error("Failed to upload avatar. Please try again.");
	};

	const handleAvatarDelete = async () => {
		try {
			setIsDeletingAvatar(true);

			// Clear the local avatar state
			setAvatarUrl("");

			// Update the profile to remove avatar
			const updateData: UpdateProfileRequest = {
				username: user.username,
				email: user.email,
				avatar: "", // Clear avatar
			};

			await AuthService.updateProfile(updateData);
			toast.success("Avatar removed successfully!");

			// Refresh user data
			await getCurrentUser();
		} catch (error) {
			console.error("Avatar delete error:", error);
			toast.error("Failed to remove avatar. Please try again.");
		} finally {
			setIsDeletingAvatar(false);
		}
	};

	const onSubmit = async (data: ProfileFormData) => {
		setIsLoading(true);
		try {
			// Update profile using the auth service
			const updateData: UpdateProfileRequest = {
				username: data.username,
				email: data.email,
			};

			// Only include avatar if a new one was uploaded
			if (avatarUrl) {
				updateData.avatar = avatarUrl;
			}

			await AuthService.updateProfile(updateData);
			toast.success("Profile updated successfully!");

			// Refresh user data to get updated information
			await getCurrentUser();
			onOpenChange(false);
		} catch (error) {
			console.error("Profile update error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update profile. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle avatar URL - either from user's existing avatar or newly uploaded one
	const currentAvatarUrl = user.avatar || DEFAULT_AVATAR;
	const displayAvatarUrl = avatarUrl || currentAvatarUrl;
	const userInitials = user.username
		? user.username.slice(0, 2).toUpperCase()
		: "U";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-lg sm:text-xl">Edit Profile</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm">
						Update your personal information and profile picture.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 sm:space-y-6"
					>
						{/* Avatar Section */}
						<Card>
							<CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
								<div className="flex flex-col items-center space-y-3 sm:space-y-4">
									<div className="relative group">
										<Avatar className="h-20 w-20 sm:h-24 sm:w-24">
											<AvatarImage
												src={displayAvatarUrl}
												alt={user.username || "User"}
											/>
											<AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
												{userInitials}
											</AvatarFallback>
										</Avatar>

										{/* Delete icon overlay - only show when there's a custom avatar and on hover */}
										{currentAvatarUrl !== DEFAULT_AVATAR && (
											<Button
												type="button"
												size="sm"
												variant="destructive"
												onClick={handleAvatarDelete}
												disabled={isDeletingAvatar || isLoading}
												className="absolute top-0 right-0 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 hover:scale-110 transition-all duration-200 disabled:hover:scale-100 opacity-0 group-hover:opacity-100"
											>
												<MdDelete className="h-3 w-3" />
											</Button>
										)}
									</div>

									{/* Upload button - only show when avatar is empty */}
									{currentAvatarUrl === DEFAULT_AVATAR &&
										!isLoading &&
										!isDeletingAvatar && (
											<UploadButton
												endpoint="imageUploader"
												onClientUploadComplete={handleAvatarUploadComplete}
												onUploadError={handleAvatarUploadError}
												config={{mode: "auto"}}
												appearance={{
													button:
														"bg-primary hover:bg-primary/90 ut-ready:bg-primary ut-ready:hover:bg-primary/90 w-[120px] text-xs sm:text-sm h-9 sm:h-10",
													allowedContent: "hidden",
												}}
											/>
										)}
								</div>
							</CardContent>
						</Card>

						{/* Form Fields */}
						<div className="space-y-3 sm:space-y-4">
							<FormField
								control={form.control}
								name="username"
								render={({field}) => (
									<FormItem>
										<FormLabel className="text-sm">Username</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isLoading}
												className="h-10 text-sm"
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({field}) => (
									<FormItem>
										<FormLabel className="text-sm">Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												disabled={isLoading}
												className="h-10 text-sm"
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="gap-2 flex-col sm:flex-row">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
								className="w-full sm:w-auto h-9 sm:h-10 text-sm"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full sm:w-auto h-9 sm:h-10 text-sm"
							>
								{isLoading ? "Updating..." : "Update Profile"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ProfileEditDialog;
