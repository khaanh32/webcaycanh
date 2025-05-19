// backend/routes/auth.js



const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    pool.query(
      "INSERT INTO users (idGoogle, displayName, email, role) VALUES (?, ?, ?, 'user') ON DUPLICATE KEY UPDATE displayName = VALUES(displayName), email = VALUES(email)",
      [req.user.id, req.user.displayName, req.user.email]
    )
      .then(() => {
        return pool.query("SELECT id, idGoogle, displayName, email, role FROM users WHERE idGoogle = ?", [req.user.id]);
      })
      .then(([rows]) => {
        if (rows.length > 0) {
          const userFromDB = rows[0];
          const token = jwt.sign({ user: userFromDB }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
        } else {
          res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user_found`);
        }
      })
      .catch((err) => {
        console.error("Error upserting user:", err);
        const token = jwt.sign({ user: { displayName: req.user.displayName, email: req.user.email, idGoogle: req.user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
      });
  }
);

module.exports = router;