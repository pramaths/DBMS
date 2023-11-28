const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Endpoint to update user information based on role
router.put('/update-profile', async (req, res) => {
  const token = req.cookies.token; // Assuming token is sent in the request cookies

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role, id } = decoded; // Assuming the decoded JWT contains 'role' and 'id' fields

    if (role === 'student' || role === 'developer') {
      // Check the role and update information based on the role
      let tableToUpdate = '';
      if (role === 'student') {
        tableToUpdate = 'students';
      } else {
        tableToUpdate = 'developers';
      }

      // Extract the fields to be updated from the request body
      const { username, phone_number, bio, expertise, github_profile, Twitter_profile, Avg_Prive_perhour, payments_details, image_url, name } = req.body;

      // Construct the update query
      const updateQuery = `
        UPDATE ${tableToUpdate}
        SET username = ?, phone_number = ?, bio = ?, expertise = ?, github_profile = ?, Twitter_profile = ?, Avg_Prive_perhour = ?,
        payments_details = ?, image_url = ?, name = ?
        WHERE id = ?`;

      // Execute the update query
      await pool.query(updateQuery, [username, phone_number, bio, expertise, github_profile, Twitter_profile, Avg_Prive_perhour, payments_details, image_url, name, id]);

      // Respond with success message
      res.status(200).json({ message: 'User information updated successfully' });
    } else {
      // Invalid role
      res.status(403).json({ error: 'Forbidden: Invalid role' });
    }
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
