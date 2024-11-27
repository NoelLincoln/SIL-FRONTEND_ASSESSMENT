// app.js or server.js
import express from "express";
import session from "express-session";
import passport from "./config/passportConfig"; // Passport configuration
import userRoutes from "./routes/userRoutes";
import albumRoutes from "./routes/albumRoutes";
import photoRoutes from "./routes/photoRoutes";
import authRoutes from "./routes/authRoutes"; // Import authentication routes
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  }),
);
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

// Use the authentication routes
app.use("/api/auth", authRoutes);

// Routes for user actions
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };
