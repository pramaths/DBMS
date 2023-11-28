const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const multer = require("multer");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log" }),
  ],
});exports.createMessage = async (req, res, next) => {
    const projectId = req.params.projectId;
    const token = req.cookies.token;
    const { messageText } = req.body;

    if (!token) {
        return next(new ErrorResponse("Token not provided", 401));
    }

    if (!projectId) {
        return next(new ErrorResponse("Project ID is required", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const [developer] = await pool.query('SELECT developer_id FROM Proposals WHERE project_id = ? AND status = "Accepted"', [projectId]);
        const developerId = developer.length ? developer[0].developer_id : null;

        if (userId !== developerId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await pool.query('INSERT INTO Conversations (student_id, developer_id, project_id, message_text) VALUES (?, ?, ?, ?)', 
                         [userId, developerId, projectId, messageText]);

        res.status(201).json({ success: true, message: "Message created successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Server Error", 500));
    }
};


exports.readMessages = async (req, res, next) => {
    const projectId = req.params.projectId;
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorResponse("Token not provided", 401));
    }

    if (!projectId) {
        return next(new ErrorResponse("Project ID is required", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const messages = await pool.query('SELECT * FROM Conversations WHERE project_id = ?', [projectId]);
        res.status(200).json({ success: true, data: messages[0] });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Server Error", 500));
    }
};
exports.updateMessage = async (req, res, next) => {
    const projectId = req.params.projectId;
    const messageId = req.params.messageId;
    const token = req.cookies.token;
    const { messageText } = req.body;

    if (!token) {
        return next(new ErrorResponse("Token not provided", 401));
    }

    if (!projectId || !messageId) {
        return next(new ErrorResponse("Project ID and Message ID are required", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await pool.query('UPDATE Conversations SET message_text = ? WHERE id = ? AND project_id = ? AND (student_id = ? OR developer_id = ?)', 
                         [messageText, messageId, projectId, userId, userId]);

        res.status(200).json({ success: true, message: "Message updated successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Server Error", 500));
    }
};

exports.deleteMessage = async (req, res, next) => {
    const projectId = req.params.projectId;
    const messageId = req.params.messageId;
    const token = req.cookies.token;

    if (!token) {
        return next(new ErrorResponse("Token not provided", 401));
    }

    if (!projectId || !messageId) {
        return next(new ErrorResponse("Project ID and Message ID are required", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await pool.query('DELETE FROM Conversations WHERE id = ? AND project_id = ? AND (student_id = ? OR developer_id = ?)', 
                         [messageId, projectId, userId, userId]);

        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Server Error", 500));
    }
};
