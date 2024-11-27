// src/config/passportConfig.ts
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GHUB_CLIENT_ID!,
      clientSecret: process.env.GHUB_CLIENT_SECRET!,
      callbackURL:
        process.env.GHUB_CALLBACK_URL ||
        "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const username = profile.username || "";
        const email = profile.emails?.[0]?.value || "";

        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              githubId: profile.id,
              username: username,
              name: profile.displayName || "",
              email: email,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
