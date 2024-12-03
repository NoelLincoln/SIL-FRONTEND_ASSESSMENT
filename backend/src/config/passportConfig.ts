import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { PrismaClient, User as PrismaUser } from "@prisma/client";

const prisma = new PrismaClient();

// Define the type for serialized user
type SerializedUser = {
  id: string;
};

// Explicitly type the user for Passport's serializeUser and deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(
  async (
    serializedUser: SerializedUser,
    done: (err: any, user?: PrismaUser | null) => void,
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: serializedUser.id },
      });
      done(null, user || null); // Pass the user object or null if not found
    } catch (err) {
      done(err, null);
    }
  },
);

// Fetch the callback URL dynamically from environment variables
const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.VITE_GHUB_CALLBACK_URL
    : process.env.VITE_GHUB_CALLBACK_URL_DEV;

// Ensure callbackURL is set
if (!callbackURL) {
  throw new Error("Callback URL is not defined in environment variables.");
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GHUB_CLIENT_ID!,
      clientSecret: process.env.GHUB_CLIENT_SECRET!,
      callbackURL: callbackURL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (err: any, user?: PrismaUser | false | null) => void,
    ) => {
      try {
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              githubId: profile.id,
              username: profile.username || "",
              name: profile.displayName || "",
              email: profile.emails?.[0]?.value || "",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;
