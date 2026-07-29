import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        await connectDB();

        const user = await User.findOne({
          username: credentials.username,
        });

        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
  signIn: "/admin/login",
},

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { username?: string }).username =
          token.username as string;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};