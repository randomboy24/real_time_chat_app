import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "",
      clientSecret: "",
    }),
  ],
  secret: "this is a secrete",
  callbacks: {
    async signIn() {
      return true;
    },
  },
});
