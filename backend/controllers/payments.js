const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const sendMail = require("../utils/mailer");
const jwt = require('jsonwebtoken');
const winston = require('winston');
const db = require('../config/db'); // Ensure this path is correct
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.simple(), 
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});
const sendVerificationEmail = async (email, verificationToken, next) => {
  const verificationLink = `http://localhost:8000/api/verifyEmail/${verificationToken}`;

  const mailOptions = {
    from: "testaccount33@gmail.com",
    to: email,
    subject: "Account Verification",
    text: `Please click the following link to verify your email: ${verificationLink}`,
  };
  try {
    await sendMail(mailOptions);
    logger.info("Verification email sent successfully");
  } catch (error) {
    logger.error("Error sending verification email:", error);
    next(new Error("Failed to send verification email"));
  }
};


exports.payments = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorResponse("Authorization token is missing", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const { amount } = req.body;
    const { project_id } = req.params; 
    const [student] = await db.query('SELECT id FROM Students WHERE email = ?', [userEmail]);
    const studentId = student[0].id;

    const [project] = await db.query('SELECT student_id FROM Projects WHERE id = ?', [project_id]);

    if (!project || project.student_id !== studentId) {
      return next(new ErrorResponse("You are not authorized to make this payment", 401));
    }
    const insertPaymentQuery = 'INSERT INTO Payments (project_id, payer_id, amount, status) VALUES (?, ?, ?, ?)';
    await db.query(insertPaymentQuery, [project_id, studentId, amount, 'Held']);
    const mailOptions = {
      from: "your@email.com", // Update with your email
      to: studentEmail,
      subject: "Payment Successful",
      text: `Dear student,\n\nYour payment for the project "${project.title}" has been successfully initiated with the amount of $${amount}.\n\nThank you for your contribution!\n\nRegards,\nYour App Team`,
    };

    await sendMail(mailOptions); // Send the emai
    res.status(200).json({ success: true, message: 'Payment initiated successfully' });
  } catch (error) {
    return next(new ErrorResponse("Invalid or expired token", 401));
  }
};