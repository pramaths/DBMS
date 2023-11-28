const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const sendMail = require("../utils/mailer");
const jwt = require('jsonwebtoken');
const winston = require('winston');
const { decode } = require("punycode");
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.simple(), 
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});
exports.review = async (req, res, next) => {
    const token = req.cookies.token;
const project_id=req.params.projectId;
console.log(req.body)
console.log(project_id)
    if (!token) {
        return next(new ErrorResponse("Authorization token is missing", 401));
    }

    let userId, userRole;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        userRole = decoded.role;
    } catch (error) {
        return next(new ErrorResponse("Token is invalid", 401));
    }

    if (userRole !== 'Student') {
        return next(new ErrorResponse("Only students can submit reviews", 403));
    }

    const {rating, review_text } = req.body;
    if (!rating || !review_text) {
        return next(new ErrorResponse("Missing required fields", 400));
    }
  
    if (rating < 1 || rating > 5) {
        return next(new ErrorResponse("Rating must be between 1 and 5", 400));
    }
    try {
        const projectProposalQuery = `
            SELECT P.developer_id 
            FROM Projects AS Proj
            JOIN Proposals AS P ON Proj.id = P.project_id
            WHERE Proj.id = ? AND Proj.student_id = ? AND P.status = 'Accepted' AND Proj.status = 'Completed'
        `;
        const [projectProposal] = await pool.query(projectProposalQuery, [project_id, userId]);

        if (projectProposal.length === 0) {
            return next(new ErrorResponse("No accepted and completed project found for this project", 404));
        }

        const developer_id = projectProposal[0].developer_id;

        const reviewQuery = 'INSERT INTO Reviews (student_id, project_id, developer_id, rating, review_text) VALUES (?, ?, ?, ?, ?)';
        await pool.query(reviewQuery, [userId, project_id, developer_id, rating, review_text]);

        res.status(201).json({
            success: true,
            message: "Review submitted successfully"
        });
    } catch (error) {
        return next(new ErrorResponse("Database error", 500));
    }
};
exports.editReview = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorResponse("Authorization token is missing", 401));
    }

    let userId, userRole;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        userRole = decoded.role;
    } catch (error) {
        return next(new ErrorResponse("Token is invalid", 401));
    }

    if (userRole !== 'Student') {
        return next(new ErrorResponse("Only students can edit reviews", 403));
    }

    const { review_id, new_review_text } = req.body;
    if (!review_id || !new_review_text) {
        return next(new ErrorResponse("Missing required fields", 400));
    }
console.log(req.body)
    try {
        const reviewQuery = 'SELECT * FROM Reviews WHERE id = ? AND student_id = ?';
        const [review] = await pool.query(reviewQuery, [review_id, userId]);

        if (review.length === 0) {
            return next(new ErrorResponse("Review not found or you are not authorized to edit this review", 404));
        }
        const updateReviewQuery = 'UPDATE Reviews SET review_text = ? WHERE id = ?';
        await pool.query(updateReviewQuery, [new_review_text, review_id]);

        res.status(200).json({
            success: true,
            message: "Review updated successfully"
        });
    } catch (error) {
        return next(new ErrorResponse("Database error", 500));
    }
};

exports.deleteReview = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorResponse("Authorization token is missing", 401));
    }

    let userId, userRole;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        userRole = decoded.role;
    } catch (error) {
        return next(new ErrorResponse("Token is invalid", 401));
    }

    if (userRole !== 'Student') {
        return next(new ErrorResponse("Only students can delete reviews", 403));
    }

    const { review_id } = req.body; 
    if (!review_id) {
        return next(new ErrorResponse("Review ID is required", 400));
    }

    try {
        const reviewQuery = 'SELECT * FROM Reviews WHERE id = ? AND student_id = ?';
        const [review] = await pool.query(reviewQuery, [review_id, userId]);

        if (review.length === 0) {
            return next(new ErrorResponse("Review not found or you are not authorized to delete this review", 404));
        }
        const deleteReviewQuery = 'DELETE FROM Reviews WHERE id = ?';
        await pool.query(deleteReviewQuery, [review_id]);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        return next(new ErrorResponse("Database error", 500));
    }
};
