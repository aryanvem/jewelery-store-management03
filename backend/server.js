require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const passport = require("passport");

// Google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    // Use environment variable for frontend URL
    res.redirect(process.env.FRONTEND_URL || "http://127.0.0.1:5500");
  }
);

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}