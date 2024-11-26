import express from "express";
import session from "express-session";
import passport from "./config/passportConfig"; // Import passport from the config file
import userRoutes from "./routes/userRoutes";
import albumRoutes from "./routes/albumRoutes";

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

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes for authentication
app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to a page after successful login
    res.redirect("/home");
  },
);

// Routes for user actions
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };
