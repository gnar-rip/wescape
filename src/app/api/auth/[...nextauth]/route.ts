import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        // Return only the shape NextAuth expects
        return {
          id: user.id,
          name: user.username ?? "",       // coerce to string
          email: user.email ?? null,
          image: user.image ?? null,
          // include username separately for later use in the token
          username: user.username ?? "",
          defaultRSN: user.defaultRSN ?? null
        } as any; // `as any` lets us pass the extra username field
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, copy custom fields to the JWT
      if (user) {
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.defaultRSN = (user as any).defaultRSN;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose custom fields from the token to the client session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.defaultRSN = token.defaultRSN as string | null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


