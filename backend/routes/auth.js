// backend/routes/auth.js



const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const router = express.Router();
// backend/routes/auth.js
// backend/routes/auth.js
router.get(
  '/google/callback',
  (req, res, next) => { // Thêm middleware để log trước khi authenticate
    console.log('Google Callback received. Query:', req.query);
    if (req.query.error) {
      console.error('Google Callback Error:', req.query.error, req.query.error_description);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`); // Redirect về trang login của frontend với lỗi
    }
    next();
  },
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=passport_failure` }), // Thêm failureRedirect
  async (req, res) => {
    try {
      console.log('Passport authentication successful. req.user:', req.user);
      if (!req.user || !req.user.id || !req.user.displayName || !req.user.email) {
        console.error('User profile from Google is incomplete:', req.user);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=profile_incomplete`);
      }

      // Đảm bảo các trường này tồn tại trước khi query
      const googleId = req.user.id;
      const displayName = req.user.displayName;
      const email = req.user.email;

      console.log(`Upserting user: idGoogle=<span class="math-inline">\{googleId\}, displayName\=</span>{displayName}, email=${email}`);
      await pool.query( // Sử dụng await ở đây để bắt lỗi nếu có
        "INSERT INTO users (idGoogle, displayName, email, role) VALUES (?, ?, ?, 'user') ON DUPLICATE KEY UPDATE displayName = VALUES(displayName), email = VALUES(email)",
        [googleId, displayName, email]
      );

      console.log('User upserted. Fetching user from DB...');
      const [rows] = await pool.query("SELECT id, idGoogle, displayName, email, role FROM users WHERE idGoogle = ?", [googleId]);

      if (rows.length > 0) {
        const userFromDB = rows[0];
        console.log('User from DB:', userFromDB);
        const token = jwt.sign({ user: userFromDB }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`Redirecting to FRONTEND_URL: ${process.env.FRONTEND_URL}/login-success with token.`);
        return res.redirect(`<span class="math-inline">\{process\.env\.FRONTEND\_URL\}/login\-success?token\=</span>{token}`);
      } else {
        console.error('User not found in DB after upsert for idGoogle:', googleId);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found_after_upsert`);
      }
    } catch (err) {
      console.error("Error in Google callback processing:", err);
      // Tránh redirect với req.user có thể không tồn tại hoặc không đầy đủ nếu lỗi xảy ra sớm
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_processing_error`);
    }
  }
);

module.exports = router;
