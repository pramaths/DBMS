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
exports.proposalsForProjects = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return next(new ErrorResponse("Authorization token is missing", 401));
  }

  let developerEmail;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token)
    console.log(decoded)
      developerEmail = decoded.email;
      console.log(developerEmail)
  } catch (error) {
      return next(new ErrorResponse("Token is invalid", 401));
  }
  try {
      const devCheckQuery = 'SELECT * FROM Developers WHERE email = ?';
      const [developer] = await db.query(devCheckQuery, [developerEmail]);
console.log("why ",developer)
      if (developer.length === 0) {
          return next(new ErrorResponse("Access denied: Only developers can submit proposals", 403));
      }

      const { proposal_text, Estimated_cost, Estimated_Time } = req.body;

      if (!proposal_text) {
          return next(new ErrorResponse("Please enter why you are the best for this project", 400));
      }
      const project_id = req.params.project_id || req.body.project_id;
      console.log("hello",project_id)
      const insertProposalQuery = 'INSERT INTO Proposals (project_id, developer_id, proposal_text, Estimated_cost, Estimated_Time) VALUES (?, ?, ?, ?, ?)';
      await db.query(insertProposalQuery, [project_id, developer[0].id, proposal_text, Estimated_cost, Estimated_Time]);

      res.status(201).json({
          success: true,
          message: "Proposal submitted successfully"
      });

  } catch (error) {
      console.error("Database error:", error);
      return next(new ErrorResponse("Database error", 500));
  }
};


exports.getProposals = async (req, res, next) => {
  const projectId = req.params.id;

  if (!projectId) {
      return next(new ErrorResponse("Project ID is required", 400));
  }

  try {
      const getProposalsQuery = `
      SELECT 
      p.*,
      d.username, 
      d.email, 
      d.bio, 
      d.image_url, 
      d.expertise, 
      d.github_profile, 
      d.Twitter_profile,
      (SELECT AVG(r.rating) 
       FROM Reviews r 
       WHERE r.developer_id = p.developer_id) AS avg_rating,
      (SELECT GROUP_CONCAT(r.review_text SEPARATOR '; ') 
       FROM Reviews r 
       WHERE r.developer_id = p.developer_id) AS reviews
  FROM 
      Proposals p 
  JOIN 
      Developers d ON p.developer_id = d.id 
  WHERE 
      p.project_id = ?
      `;
      const [proposals] = await db.query(getProposalsQuery, [projectId]);
      console.log(proposals);
      if (proposals.length === 0) {
          return res.status(200).json({
              success: true,
              message: "No proposals found for this project"
          });
      }

      res.status(200).json({
          success: true,
          data: proposals
      });

  } catch (error) {
      console.error("Database error:", error);
      return next(new ErrorResponse("Database error", 500));
  }
};
exports.acceptProposal = async (req, res, next) => {
    const { proposalId } = req.body;
    const projectId = req.params.projectId;
    const token = req.cookies.token; 
  console.log("proposal id",proposalId)
  console.log("projectid",projectId)
  if (!token) {
    console.log("Token not found in request");
    return next(new ErrorResponse("Token not provided", 401));
}
    if (!proposalId || !projectId) {
      return next(new ErrorResponse("Proposal ID and Project ID are required", 400));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded)
      const studentId = decoded.id;
      console.log(studentId)
      const [project] = await db.query('SELECT student_id FROM Projects WHERE id = ?', [projectId]);
      if (project[0].student_id !== studentId) {
        return res.status(403).json({ message: 'Unauthorized to accept this proposal' });
      }
      const [proposal] = await db.query('SELECT Estimated_cost FROM Proposals WHERE id = ?', [proposalId]);
      const estimatedCost = proposal[0].Estimated_cost;
      const insertPaymentQuery = 'INSERT INTO Payments (project_id, payer_id, amount, status) VALUES (?, ?, ?, ?)';
      await db.query(insertPaymentQuery, [projectId, studentId, estimatedCost, 'Held']);
      await db.query('CALL AcceptProposal(?, ?)', [proposalId, projectId]);
      const [developer] = await db.query('SELECT email FROM Developers WHERE id = ?', [proposal[0].developer_id]);
        const developerEmail = developer[0].email;
        const [student] = await db.query('SELECT email FROM Students WHERE id = ?', [studentId]);
        const studentEmail = student[0].email;
        const developerMailOptions = {
            from: "testaccount33@gmail.com",
            to: developerEmail,
            subject: "Proposal Accepted",
            text: "Your proposal has been accepted. Congratulations!",
        };
        const studentMailOptions = {
            from: "testaccount33@gmail.com",
            to: studentEmail,
            subject: "Payment Successful",
            text: `You have successfully paid $${estimatedCost} for the project.`,
        };
        try {
            await sendMail(developerMailOptions);
            await sendMail(studentMailOptions);
            logger.info("Emails sent successfully");
        } catch (emailError) {
            logger.error("Error sending emails:", emailError);
            return next(new ErrorResponse("Failed to send emails", 500));
        }

      res.status(200).json({
        success: true,
        message: "Proposal accepted successfully"
      });
  
    } catch (error) {
      console.error("Error:", error);
      return next(new ErrorResponse("Database error", 500));
    }
  };
