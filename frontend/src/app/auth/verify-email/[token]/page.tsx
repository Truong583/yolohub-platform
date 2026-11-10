"use client";

import {useState, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useVerifyEmail} from "@/hooks/use-auth";
import Link from "next/link";
import {CheckCircle, XCircle, Loader2} from "lucide-react";
import {ROUTE_CONFIG} from "@/configs/routes";

type VerificationState = "idle" | "success" | "error";

interface ApiResponse {
	success: boolean;
	message: string;
	statusCode: number;
}

// Verify email page - Arrow function
const VerifyEmailPage = () => {
	const params = useParams();
	const router = useRouter();
	const [state, setState] = useState<VerificationState>("idle");
	const [message, setMessage] = useState("");

	const token = params.token as string;

	// Tanstack Query mutation
	const verifyEmailMutation = useVerifyEmail();

	// Handle verification on component mount
	useEffect(() => {
		if (!token) {
			setState("error");
			setMessage("Invalid verification link");
			return;
		}

		// Trigger verification with callbacks
		verifyEmailMutation.mutate(
			{token},
			{
				onSuccess: (response: ApiResponse) => {
					setState("success");
					setMessage(response.message);
					// Auto-redirect on success after 3 seconds
					setTimeout(() => {
						router.push(ROUTE_CONFIG.AUTH.SIGN_IN);
					}, 3000);
				},
				onError: (error) => {
					setState("error");

					const errorMessage =
						error?.message || "Failed to verify email. Please try again.";
					setMessage(errorMessage);
				},
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	// Determine current state
	const currentState = verifyEmailMutation.isPending ? "loading" : state;

	const getIcon = () => {
		switch (currentState) {
			case "loading":
				return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />;
			case "success":
				return <CheckCircle className="h-12 w-12 text-green-600" />;
			case "error":
				return <XCircle className="h-12 w-12 text-red-600" />;
			default:
				return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />;
		}
	};

	const getTitle = () => {
		switch (currentState) {
			case "loading":
				return "Verifying Email";
			case "success":
				return "Email Verified!";
			case "error":
				return "Verification Failed";
			default:
				return "Verifying Email";
		}
	};

	const getTitleColor = () => {
		switch (currentState) {
			case "success":
				return "text-green-600";
			case "error":
				return "text-red-600";
			default:
				return "text-foreground";
		}
	};

	const getBackgroundColor = () => {
		switch (currentState) {
			case "loading":
				return "bg-blue-100";
			case "success":
				return "bg-green-100";
			case "error":
				return "bg-red-100";
			default:
				return "bg-blue-100";
		}
	};

	return (
		<div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 py-8 sm:w-[480px] sm:p-8">
				<Card className="py-6">
					<CardHeader className="text-center">
						<div
							className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${getBackgroundColor()}`}
						>
							{getIcon()}
						</div>
						<CardTitle className={`text-2xl ${getTitleColor()}`}>
							{getTitle()}
						</CardTitle>
						<CardDescription className="text-base">{message}</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Loading State */}
						{currentState === "loading" && (
							<div className="text-center">
								<p className="text-sm text-muted-foreground">
									Please wait while we verify your email address...
								</p>
							</div>
						)}

						{/* Success State */}
						{currentState === "success" && (
							<div className="text-center space-y-4">
								<div className="rounded-lg border bg-green-50 p-4">
									<p className="text-sm text-green-800">
										🎉 Your email has been verified successfully! You can now
										access your account.
									</p>
								</div>
								<p className="text-sm text-muted-foreground">
									Redirecting you to sign in page in a few seconds...
								</p>
								<Button asChild size="lg" className="w-full">
									<Link href="/auth/sign-in">Continue to Sign In</Link>
								</Button>
							</div>
						)}

						{/* Error State */}
						{currentState === "error" && (
							<div className="text-center space-y-4">
								<div className="rounded-lg border bg-red-50 p-4">
									<p className="text-sm text-red-800">
										❌{" "}
										{message ||
											"There was a problem verifying your email address."}
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default VerifyEmailPage;
