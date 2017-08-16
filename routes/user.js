const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/_helpers');

router.get('/user', authHelpers.loginRequired, (req, res, next)  => {
  handleResponse(res, 200, 'success', req.user.username);
});

function handleResponse(res, code, statusMsg,username) {
  res.status(code).json({status: statusMsg, username: username});
}

module.exports = router;