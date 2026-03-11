import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";

type AppUser = User & {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  accessToken?: string;
  refreshToken?: string;
};

const ADMIN_ROLE = "ADMIN";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          const data = res.data;

          if (!data?.status || !data?.data?.user || !data?.data?.accessToken) {
            return null;
          }

          const user = data.data.user;

          if (user.role !== ADMIN_ROLE) {
            throw new Error("ADMIN_ONLY");
          }

          return {
            ...user,
            id: user._id,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken ?? user.refreshToken,
          };
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
              ? error.message
              : "Login failed";

          if (errorMessage === "Invalid credentials") {
            throw new Error("INVALID_CREDENTIALS");
          }

          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      const appUser = user as AppUser | undefined;

      if (appUser) {
        token.accessToken = appUser.accessToken;
        token.refreshToken = appUser.refreshToken;
        token.user = {
          _id: appUser._id,
          firstName: appUser.firstName,
          lastName: appUser.lastName,
          email: appUser.email,
          role: appUser.role,
          profileImage: appUser.profileImage,
        };
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};
