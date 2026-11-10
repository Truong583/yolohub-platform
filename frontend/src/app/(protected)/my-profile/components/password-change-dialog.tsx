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
import {Button} from "@/components/ui/button";
import {PasswordInput} from "@/components/password-input";
import {toast} from "sonner";
import {useAuthStore} from "@/stores/auth-store";
import {AuthService, ChangePasswordRequest} from "@/services/auth";

// Validation schema for password change
const passwordChangeSchema = yup.object({
	currentPassword: yup.string().required("Current password is required"),
	newPassword: yup
		.string()
		.required("New password is required")
		.min(8, "Password must be at least 8 characters long")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	confirmPassword: yup
		.string()
		.required("Please confirm your new password")
		.oneOf([yup.ref("newPassword")], "Passwords must match"),
});

type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;

interface PasswordChangeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Password change dialog component - Arrow function
const PasswordChangeDialog = ({
	open,
	onOpenChange,
}: PasswordChangeDialogProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const user = useAuthStore((state) => state.user);

	const form = useForm<PasswordChangeFormData>({
		resolver: yupResolver(passwordChangeSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: PasswordChangeFormData) => {
		setIsLoading(true);
		try {
			const changePasswordData: ChangePasswordRequest = {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			};

			await AuthService.changePassword(changePasswordData);
			toast.success("Password changed successfully!");
			form.reset();
			onOpenChange(false);

			// Optionally log out the user to force re-authentication with new password
			// This is a security best practice for sensitive operations
			toast.info("Please sign in again with your new password for security.");
			setTimeout(() => {
				useAuthStore.getState().logout();
			}, 2000);
		} catch (error) {
			console.error("Password change error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to change password. Please check your current password and try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Only show password change for default users (not social logins)
	if (user?.userType !== "default") {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-lg sm:text-xl">
							Password Change
						</DialogTitle>
						<DialogDescription className="text-xs sm:text-sm">
							Password change is not available for social login accounts.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4 sm:py-6 text-center px-4">
						<p className="text-sm sm:text-base text-muted-foreground">
							Your account is linked to{" "}
							{user?.userType === "google" ? "Google" : "Facebook"}. Please
							change your password through your{" "}
							{user?.userType === "google" ? "Google" : "Facebook"} account
							settings.
						</p>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="w-full sm:w-auto h-9 sm:h-10 text-sm"
						>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-lg sm:text-xl">
						Change Password
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm">
						Update your account password. Make sure to use a strong password.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3 sm:space-y-4"
					>
						<FormField
							control={form.control}
							name="currentPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel className="text-sm">Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											{...field}
											disabled={isLoading}
											placeholder="Enter your current password"
											className="h-10 text-sm"
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel className="text-sm">New Password</FormLabel>
									<FormControl>
										<PasswordInput
											{...field}
											disabled={isLoading}
											placeholder="Enter your new password"
											className="h-10 text-sm"
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({field}) => (
								<FormItem>
									<FormLabel className="text-sm">
										Confirm New Password
									</FormLabel>
									<FormControl>
										<PasswordInput
											{...field}
											disabled={isLoading}
											placeholder="Confirm your new password"
											className="h-10 text-sm"
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						{/* Password Requirements */}
						<div className="p-2.5 sm:p-3 bg-muted rounded-lg">
							<p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
								Password Requirements:
							</p>
							<ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5 sm:space-y-1">
								<li>• At least 8 characters long</li>
								<li>• At least one uppercase letter</li>
								<li>• At least one lowercase letter</li>
								<li>• At least one number</li>
							</ul>
						</div>

						<DialogFooter className="gap-2 flex-col sm:flex-row">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									form.reset();
									onOpenChange(false);
								}}
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
								{isLoading ? "Changing..." : "Change Password"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default PasswordChangeDialog;
