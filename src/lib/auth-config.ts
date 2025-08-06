import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock users database - en producción esto vendría de una base de datos real
const users = [
  {
    id: "1",
    email: "admin@tienda.com",
    name: "Administrador",
    role: "admin",
    password: "$2b$12$O18.gJEMoFA93UzyKtPxWuX/uv3/2EC.yKpc0kt.EqhYBYRrohL5u", // admin123
  },
  {
    id: "2",
    email: "usuario@tienda.com",
    name: "Usuario Test",
    role: "user",
    password: "$2b$12$O18.gJEMoFA93UzyKtPxWuX/uv3/2EC.yKpc0kt.EqhYBYRrohL5u", // admin123
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("=== Authorization attempt ===");
          console.log("Email:", credentials?.email);
          console.log("Password provided:", !!credentials?.password);

          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = users.find((u) => u.email === credentials.email);

          if (!user) {
            console.log("User not found:", credentials.email);
            console.log(
              "Available users:",
              users.map((u) => u.email)
            );
            return null;
          }

          console.log("User found:", user.email);
          console.log("Stored hash:", user.password);
          console.log("Password to compare:", credentials.password);

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("User authenticated successfully:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
