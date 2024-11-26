// src/app.ts

import express from "express";
import passport from "passport";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { Strategy as GitHubStrategy } from "passport-github";
import userRoutes from "./routes/userRoutes";

const prisma = new PrismaClient();

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Session setup
app.use(
  session({
    secret: "vfdfsdc3221",
    resave: false,
    saveUninitialized: true,
  }),
);

// Passport setup - GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ensure username and email are valid before passing to Prisma
        const username = profile.username || "";
        const email = profile.emails?.[0]?.value || "";

        // Find or create user in the database
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

passport.deserializeUser(async (id: unknown, done: any) => {
  const userId = id as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes for authentication
app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Redirect to a page after successful login
    res.redirect("/home");
  },
);

// Routes for user actions
app.use("/api/users", userRoutes);

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
