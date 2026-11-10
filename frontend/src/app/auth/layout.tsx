import {AuthOnlyRoute} from "@/components/auth/protected-route";

interface Props {
	children: React.ReactNode;
}

// Auth layout - Arrow function
const AuthLayout = ({children}: Props) => {
	return (
		<AuthOnlyRoute>
			<div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
					{children}
				</div>
			</div>
		</AuthOnlyRoute>
	);
};

export default AuthLayout;
