"use client";
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
import {
	useRegister,
	useSocialLogin,
	useSocialRegistration,
} from "@/hooks/use-auth";
import {cn} from "@/lib/utils";
import {yupResolver} from "@hookform/resolvers/yup";
import {useSession} from "next-auth/react";
import * as React from "react";
import {HTMLAttributes} from "react";
import {useForm} from "react-hook-form";
import {FaFacebook} from "react-icons/fa6";
import {GrGoogle} from "react-icons/gr";
import * as yup from "yup";
type SignUpFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = yup.object({
	username: yup
		.string()
		.required("Please enter your username")
		.min(2, "Username must be at least 2 characters"),
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password")
		.min(8, "Password must be at least 8 characters long")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),

	confirmPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf([yup.ref("password")], "Passwords don't match."),
});

// Sign-up form component - Arrow function
const SignUpForm = ({className, ...props}: SignUpFormProps) => {
	const {data: session} = useSession();
	const registerMutation = useRegister();
	const socialRegistration = useSocialRegistration();
	const socialLoginMutation = useSocialLogin();

	const form = useForm<yup.InferType<typeof formSchema>>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(data: yup.InferType<typeof formSchema>) {
		registerMutation.mutate({
			username: data.username,
			email: data.email,
			password: data.password,
			confirmPassword: data.confirmPassword,
		});
	}

	function handleSocialSignUp(provider: "google" | "facebook") {
		socialLoginMutation.mutate({
			provider,
		});
	}

	// Handle social registration flow when NextAuth session is established
	React.useEffect(() => {
		if (
			session &&
			(session.provider === "google" || session.provider === "facebook")
		) {
			// Step 2: After NextAuth creates temporary session, verify with backend
			if (session.provider === "google" && session.idToken) {
				socialRegistration.registerWithProvider("google", session.idToken);
			} else if (session.provider === "facebook" && session.accessToken) {
				socialRegistration.registerWithProvider(
					"facebook",
					session.accessToken
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

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
					name="username"
					render={({field}) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Enter your username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({field}) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<PasswordInput placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className="mt-2"
					disabled={
						registerMutation.isPending ||
						socialRegistration.isLoading ||
						socialLoginMutation.isPending
					}
				>
					{registerMutation.isPending
						? "Creating Account..."
						: "Create Account"}
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
						disabled={
							registerMutation.isPending ||
							socialRegistration.isLoading ||
							socialLoginMutation.isPending
						}
						onClick={() => handleSocialSignUp("google")}
					>
						<GrGoogle />
						<span className="pl-1"> Google</span>
					</Button>
					<Button
						variant="outline"
						type="button"
						disabled={
							registerMutation.isPending ||
							socialRegistration.isLoading ||
							socialLoginMutation.isPending
						}
						onClick={() => handleSocialSignUp("facebook")}
					>
						<FaFacebook />
						<span className="pl-1"> Facebook</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignUpForm;
