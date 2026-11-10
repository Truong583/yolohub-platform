import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			image?: string | null;
			accessToken?: string;
			refreshToken?: string;
			roles?: Array<{
				_id: string;
				name: string;
				description: string;
				permissions: string[];
			}>;
			userPermissions?: string[];
			userType?: string;
			status?: string;
			provider?: string;
		};
		// Add session-level tokens and provider info
		idToken: string;
		accessToken: string;
		refreshToken: string;
		provider: string;
	}

	interface User {
		id: string;
		email: string;
		name: string;
		image?: string | null;
		accessToken?: string;
		refreshToken?: string;
		roles?: Array<{
			_id: string;
			name: string;
			description: string;
			permissions: string[];
		}>;
		userPermissions?: string[];
		userType?: string;
		status?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		idToken?: string;
		accessToken?: string;
		refreshToken?: string;
		provider?: string;
		roles?: Array<{
			_id: string;
			name: string;
			description: string;
			permissions: string[];
		}>;
		userPermissions?: string[];
		userType?: string;
		status?: string;
	}
}
