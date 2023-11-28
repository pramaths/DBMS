const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    Userinfo,
    checkAccess
  } = require("../controllers/auth");
  
  router.post("/signup", signup);
  router.get("/verifyEmail/:verificationToken", verifyEmail);
  router.post("/signin", signin);
  router.get("/logout", logout);
  router.post("/forgotpassword", forgotPassword);
  router.post("/resetpassword/:resetToken", resetPassword);
  router.post("/changepassword",changePassword);
  router.get("/user",Userinfo)
  router.get('/api/projects/:projectId/check-access',checkAccess)
module.exports = router;
