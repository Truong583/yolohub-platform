"use client";
import {HTMLAttributes} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useRouter} from "next/navigation";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {PasswordInput} from "@/components/password-input";
import {useResetPassword} from "@/hooks/use-auth";
import {KeyRound} from "lucide-react";
import Link from "next/link";
import {ROUTE_CONFIG} from "@/configs/routes";

interface ResetPasswordFormProps extends HTMLAttributes<HTMLFormElement> {
	token: string;
}

const formSchema = yup.object({
	newPassword: yup
		.string()
		.required("Please enter your new password")
		.min(8, "Password must be at least 8 characters long")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	confirmNewPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf([yup.ref("newPassword")], "Passwords must match"),
});

type FormData = yup.InferType<typeof formSchema>;

// Reset password form component - Arrow function
const ResetPasswordForm = ({
	token,
	className,
	...props
}: ResetPasswordFormProps) => {
	const router = useRouter();
	const resetPasswordMutation = useResetPassword();

	const form = useForm<FormData>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	async function onSubmit(data: FormData) {
		await resetPasswordMutation.mutateAsync({
			token,
			newPassword: data.newPassword,
		});

		// Redirect to sign-in after a short delay
		setTimeout(() => {
			router.push(ROUTE_CONFIG.AUTH.SIGN_IN);
		}, 3000);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("grid gap-6", className)}
				{...props}
			>
				<div className="space-y-2 text-center">
					<div className="flex justify-center">
						<div className="rounded-full bg-blue-100 p-3">
							<KeyRound className="h-6 w-6 text-blue-600" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground">
						Enter your new password below. Make sure it&apos;s strong and
						secure.
					</p>
				</div>

				<FormField
					control={form.control}
					name="newPassword"
					render={({field}) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<PasswordInput
									placeholder="Enter your new password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmNewPassword"
					render={({field}) => (
						<FormItem>
							<FormLabel>Confirm New Password</FormLabel>
							<FormControl>
								<PasswordInput
									placeholder="Confirm your new password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={resetPasswordMutation.isPending}
					className="w-full"
				>
					{resetPasswordMutation.isPending
						? "Updating Password..."
						: "Update Password"}
				</Button>

				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						Remember your password?{" "}
						<Link
							href={ROUTE_CONFIG.AUTH.SIGN_IN}
							className="text-primary hover:underline"
						>
							Back to Sign In
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
};

export default ResetPasswordForm;
