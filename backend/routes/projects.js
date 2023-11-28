const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, document, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, document, cb) {
      cb(
        null,
        document.fieldname + "-" + Date.now() + "-" + document.originalname
      );
    },
  });
  
  const upload = multer({ storage: storage });
router.post('/postproject',upload.single('document'),projectController.postProject);

router.get('/projects',projectController.getProjectsByStatus);
router.get('/project/:project_id',projectController.SingleProject);
router.get('/myproject/',projectController.myProject);
router.delete('/deleteproject/:projectId', projectController.deleteProject);
module.exports = router;
