const pool = require('../config/db'); 
const sendMail = require('../utils/mailer');
const crypto = require('crypto');
exports.createDoc = async (req, res) => {
    const project_id=req.params.project_id;
    console.log(project_id)
  try {
    const { title, description, file_path} = req.body;

    const insertDocQuery = 'INSERT INTO Docs (title, description, file_path) VALUES (?, ?, ?)';
    const [docResult] = await pool.query(insertDocQuery, [title, description, file_path]);
    const docId = docResult.insertId;

    const insertProjectDocQuery = 'INSERT INTO ProjectDocs (project_id, doc_id) VALUES (?, ?)';
    await pool.query(insertProjectDocQuery, [project_id, docId]);

    const getStudentEmailQuery = 'SELECT email FROM Students JOIN Projects ON Students.id = Projects.student_id WHERE Projects.id = ?';
    const [studentResult] = await pool.query(getStudentEmailQuery, [project_id]);
    if (studentResult.length === 0) {
      throw new Error('Student not found for the provided project ID');
    }
    const studentEmail = studentResult[0].email;
    const mailOptions = {
      from: 'testaccount33@gmail.com',
      to: studentEmail,
      subject: 'Document Uploaded for Your Project',
      text: `A new document has been uploaded for your project. Please review it here: ${file_path}`,
    };
    await sendMail(mailOptions);

    res.status(201).json({ message: 'Document inserted successfully' });
  } catch (error) {
    console.error('Error inserting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyCompletion = async (req, res) => {
    try {
        const { project_id, token } = req.params;

        // Validate the token
        const validationQuery = 'SELECT verification_token FROM Projects WHERE id = ?';
        const [project] = await pool.query(validationQuery, [project_id]);

        if (project.length === 0 || project[0].verification_token !== token) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        const proposalQuery = 'SELECT developer_id FROM Proposals WHERE project_id = ? AND status = "Accepted"';
        const [proposal] = await pool.query(proposalQuery, [project_id]);

        if (proposal.length === 0) {
            return res.status(404).json({ message: 'Accepted proposal not found' });
        }
        const devID = proposal[0].developer_id;
        await pool.query('UPDATE Projects SET status = "Completed" WHERE id = ?', [project_id]);

        await pool.query('UPDATE Developers SET Completed_projects_Count = Completed_projects_Count + 1 WHERE id = ?', [devID]);

        const [avgPriceResult] = await pool.query('SELECT CalculateAveragePrice(?) AS avgPrice', [devID]);
        const avgPrice = avgPriceResult[0].avgPrice;

        await pool.query('UPDATE Developers SET Avg_Prive_perhour = ? WHERE id = ?', [avgPrice, devID]);

        await pool.query('UPDATE Payments SET status = "Released" WHERE project_id = ?', [project_id]);

        res.status(200).json({ message: 'Project marked as completed, funds released, and developer count incremented' });
    } catch (error) {
        console.error('Error verifying project completion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.sendVerificationEmail = async (req,res) => {
    const projectId=req.params.projectId;
    console.log(projectId)
    const numericProjectId = parseInt(projectId, 10);
    

    try {
        const token = crypto.randomBytes(16).toString('hex');
        console.log(token)
        console.log(numericProjectId)
        await pool.query('UPDATE Projects SET verification_token = ? WHERE id = ?', [token, numericProjectId]);
        const getStudentEmailQuery = `
            SELECT Students.email 
            FROM Students 
            JOIN Projects ON Students.id = Projects.student_id 
            WHERE Projects.id = ?`;

        const [studentResult] = await pool.query(getStudentEmailQuery, [projectId]);
console.log(studentResult)
        if (studentResult.length === 0) {
            throw new Error('No student found for the given project ID');
        }
        const studentEmail = studentResult[0].email;
        const verificationLink = `http://localhost:8000/api/verify-completion/${projectId}/${token}`;
        const mailOptions = {
            from: 'testaccount33@gmail.com',
            to: studentEmail,
            subject: 'Verify Project Completion',
            text: `Please confirm project completion here: ${verificationLink}`
        };

        await sendMail(mailOptions);
    } catch (error) {
        console.error('Error in sendVerificationEmail:', error);
    }
};


