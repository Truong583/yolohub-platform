"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Dynamic import for form component (client-side auth, ssr: false)
const ResetPasswordForm = dynamic(
	() => import("./components/reset-password-form"),
	{
		ssr: false,
	}
);

interface ResetPasswordPageProps {
	params: Promise<{
		token: string;
	}>;
}

// Reset password page - Arrow function
const ResetPasswordPage = ({params}: ResetPasswordPageProps) => {
	const resolvedParams = React.use(params);

	return (
		<Card className="gap-4 py-6">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Reset Password</CardTitle>
				<CardDescription>
					Enter your new password to complete the reset process.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResetPasswordForm token={resolvedParams.token} />
			</CardContent>
		</Card>
	);
};

export default ResetPasswordPage;
