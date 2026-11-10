"use client";

import dynamic from "next/dynamic";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Dynamic import for form component (client-side auth, ssr: false)
const ForgotPasswordForm = dynamic(
	() => import("./components/forgot-password-form"),
	{
		ssr: false,
	}
);

// Forgot password page - Arrow function
const ForgotPassword = () => {
	return (
		<Card className="gap-4 py-6">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Forgot Password</CardTitle>
				<CardDescription>
					Don&apos;t worry, we&apos;ll help you reset your password.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
			</CardContent>
		</Card>
	);
};

export default ForgotPassword;
