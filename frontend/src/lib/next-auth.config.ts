import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			name: "google",
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			name: "facebook",
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	callbacks: {
		async jwt({token, account}) {
			if (account) {
				// Only store OAuth tokens for your custom backend integration
				token.idToken = account.id_token;
				token.accessToken = account.access_token;
				token.provider = account.provider;
			}
			return token;
		},

		async session({session, token}) {
			// Expose OAuth tokens for your custom backend calls
			session.idToken = token.idToken as string;
			session.provider = token.provider as string;
			session.accessToken = token.accessToken as string;
			return session;
		},

		async signIn() {
			return true;
		},
	},

	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},

	debug: process.env.NODE_ENV === "development",
};

export default authOptions;
