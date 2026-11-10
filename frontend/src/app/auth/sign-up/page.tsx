import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {ROUTE_CONFIG} from "@/configs/routes";
import Link from "next/link";
import SignUpForm from "./components/sign-up-form";

// Sign-up page - Arrow function
const SignUp = async () => {
	return (
		<Card className="gap-4 py-6">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Create an account</CardTitle>
				<CardDescription>
					Enter your email and password to create an account. <br />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
			</CardContent>
			<CardFooter>
				<p className="text-muted-foreground w-full px-8 text-center text-sm">
					Already have an account?{" "}
					<Link
						href={ROUTE_CONFIG.AUTH.SIGN_IN}
						className="hover:text-primary underline underline-offset-4"
					>
						Sign In
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
};

export default SignUp;
