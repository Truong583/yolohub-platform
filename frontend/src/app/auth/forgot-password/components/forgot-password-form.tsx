"use client";
import {HTMLAttributes, useState} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

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
import {Input} from "@/components/ui/input";
import {useForgotPassword} from "@/hooks/use-auth";
import {AlertCircle, CheckCircle, Mail} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import Link from "next/link";
import {ROUTE_CONFIG} from "@/configs/routes";

type ForgotPasswordFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = yup.object({
	email: yup
		.string()
		.required("Please enter your email address")
		.email("Please enter a valid email address"),
});

type FormData = yup.InferType<typeof formSchema>;

// Forgot password form component - Arrow function
const ForgotPasswordForm = ({className, ...props}: ForgotPasswordFormProps) => {
	const [isEmailSent, setIsEmailSent] = useState(false);
	const forgotPasswordMutation = useForgotPassword();

	const form = useForm<FormData>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: FormData) {
		try {
			await forgotPasswordMutation.mutateAsync(data);
			setIsEmailSent(true);
		} catch {
			// Error handling is done in the hook
		}
	}

	function handleSendAnother() {
		setIsEmailSent(false);
		form.reset();
	}

	if (isEmailSent) {
		return (
			<div className={cn("grid gap-6", className)}>
				<Alert className="border-green-200 bg-green-50">
					<CheckCircle className="h-4 w-4 text-green-600" />
					<AlertDescription className="text-green-800">
						<strong>Email sent successfully!</strong>
						<br />
						We&apos;ve sent a password reset link to{" "}
						<strong>{form.getValues("email")}</strong>. Please check your inbox
						and follow the instructions to reset your password.
					</AlertDescription>
				</Alert>

				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<div className="rounded-full bg-green-100 p-3">
							<Mail className="h-6 w-6 text-green-600" />
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							Didn&apos;t receive the email? Check your spam folder or
						</p>
						<Button
							variant="outline"
							onClick={handleSendAnother}
							disabled={forgotPasswordMutation.isPending}
						>
							Send another email
						</Button>
					</div>

					<div className="pt-4 border-t">
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
				</div>
			</div>
		);
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
							<AlertCircle className="h-6 w-6 text-blue-600" />
						</div>
					</div>
					<p className="text-sm text-muted-foreground">
						Enter your email address and we&apos;ll send you a link to reset
						your password.
					</p>
				</div>

				<FormField
					control={form.control}
					name="email"
					render={({field}) => (
						<FormItem>
							<FormLabel>Email Address</FormLabel>
							<FormControl>
								<Input placeholder="name@example.com" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={forgotPasswordMutation.isPending}
					className="w-full"
				>
					{forgotPasswordMutation.isPending ? "Sending..." : "Reset Password"}
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

export default ForgotPasswordForm;
