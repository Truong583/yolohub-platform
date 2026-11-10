"use client";

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Loader from "@/components/loader";

// Auth error inner component - Arrow function
const AuthErrorInner = () => {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (error: string | null) => {
		switch (error) {
			case "Configuration":
				return "There is a problem with the server configuration.";
			case "AccessDenied":
				return "Access denied. You do not have permission to sign in.";
			case "Verification":
				return "The verification token has expired or has already been used.";
			case "Default":
				return "An error occurred during authentication.";
			default:
				return "An unknown error occurred during authentication.";
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-xl text-destructive">
						Authentication Error
					</CardTitle>
					<CardDescription>{getErrorMessage(error)}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<div className="rounded-md bg-destructive/10 p-3">
							<p className="text-sm text-destructive">Error code: {error}</p>
						</div>
					)}
					<div className="space-y-2">
						<Button asChild className="w-full">
							<Link href="/auth/sign-in">Try Again</Link>
						</Button>
						<Button asChild variant="outline" className="w-full">
							<Link href="/">Go Home</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

// Auth error page - Arrow function
const AuthError = () => {
	return (
		<Suspense fallback={<Loader />}>
			<AuthErrorInner />
		</Suspense>
	);
};

export default AuthError;
