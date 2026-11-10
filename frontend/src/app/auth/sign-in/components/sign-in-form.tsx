"use client";
import {yupResolver} from "@hookform/resolvers/yup";
import {HTMLAttributes, useCallback, useEffect} from "react";
import {useForm} from "react-hook-form";
import * as yup from "yup";

import Loader from "@/components/loader";
import {PasswordInput} from "@/components/password-input";
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
import {ROUTE_CONFIG} from "@/configs/routes";
import {useLogin, useSocialLogin} from "@/hooks/use-auth";
import {cn} from "@/lib/utils";
import AuthService from "@/services/auth";
import {useAuthStore} from "@/stores/auth-store";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {FaFacebook} from "react-icons/fa6";
import {GrGoogle} from "react-icons/gr";
import {toast} from "sonner";

type SignInFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = yup.object({
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password")
		.min(7, "Password must be at least 7 characters long"),
});

type FormData = yup.InferType<typeof formSchema>;

// Sign-in form component - Arrow function
const SignInForm = ({className, ...props}: SignInFormProps) => {
	const {data: session} = useSession();
	const loginMutation = useLogin();
	const socialLoginMutation = useSocialLogin();

	const {getCurrentUser} = useAuthStore();

	const form = useForm<FormData>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(data: FormData) {
		loginMutation.mutate({
			email: data.email,
			password: data.password,
		});
	}

	function handleSocialLogin(provider: "google" | "facebook") {
		socialLoginMutation.mutate({
			provider,
		});
	}

	const handleLoginAuthSocial = useCallback(async () => {
		try {
			let authResponse = null;

			// Call appropriate backend login API
			if (session?.provider === "google" && session.idToken) {
				authResponse = await AuthService.loginWithGoogle(session.idToken);
			} else if (session?.provider === "facebook" && session.accessToken) {
				authResponse = await AuthService.loginWithFacebook(session.accessToken);
			}

			if (authResponse?.token) {
				// Store backend tokens
				if (typeof window !== "undefined") {
					localStorage.setItem("access_token", authResponse.token);
					localStorage.setItem("refresh_token", authResponse.refreshToken);
				}

				await getCurrentUser();

				toast.success("Login successful!");
			}
		} catch (error) {
			await signOut({redirect: false});

			toast.error(
				(error as Error)?.message || "Login failed. Please try again."
			);
		}
	}, [session, getCurrentUser]);

	useEffect(() => {
		if (session) {
			handleLoginAuthSocial();
		}
	}, [session, handleLoginAuthSocial]);

	if (session) {
		return <Loader />;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("grid gap-6", className)}
				{...props}
			>
				<FormField
					control={form.control}
					name="email"
					render={({field}) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="name@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({field}) => (
						<FormItem className="relative">
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
							<Link
								href={ROUTE_CONFIG.AUTH.FORGOT_PASSWORD}
								className=" absolute -top-0.5 right-0 text-sm  hover:opacity-75"
							>
								Forgot password?
							</Link>
						</FormItem>
					)}
				/>
				<Button className="mt-2" disabled={loginMutation.isPending}>
					{loginMutation.isPending ? "Signing in..." : "Login"}
				</Button>

				<div className="relative my-2">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background text-muted-foreground px-2">
							Or continue with
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						type="button"
						disabled={loginMutation.isPending || socialLoginMutation.isPending}
						onClick={() => handleSocialLogin("google")}
					>
						<GrGoogle />
						<span className="pl-1"> Google</span>
					</Button>
					<Button
						variant="outline"
						type="button"
						disabled={loginMutation.isPending || socialLoginMutation.isPending}
						onClick={() => handleSocialLogin("facebook")}
					>
						<FaFacebook />
						<span className="pl-1"> Facebook</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignInForm;
