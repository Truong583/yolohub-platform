import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {ROUTE_CONFIG} from "@/configs/routes";
import SignInForm from "./components/sign-in-form";

// Sign-in page - Arrow function
const SignIn = () => {
	return (
		<Card className="gap-4 py-6">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignInForm />
			</CardContent>
			<CardFooter>
				<p className="text-muted-foreground w-full px-8 text-center text-sm">
					Don&apos;t have an account?{" "}
					<a
						href={ROUTE_CONFIG.AUTH.SIGN_UP}
						className="hover:text-primary underline underline-offset-4"
					>
						Sign up
					</a>
				</p>
			</CardFooter>
		</Card>
	);
};

export default SignIn;
