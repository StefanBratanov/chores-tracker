var express = require('express');
var router = express.Router();
var userChoresController = require('../db/controllers').user_chores;
var authHelpers = require('../auth/_helpers');

/* GET chores for the user. */
router.get('/', authHelpers.loginRequired , userChoresController.list);

/* POST a new chore for the user. */
router.post('/', authHelpers.loginRequired, userChoresController.create);

/* UPDATE a chore for the user with the latest completed time. */
router.put('/', authHelpers.loginRequired, userChoresController.update);

/* DELETE a chore for the user. */
router.delete('/', authHelpers.loginRequired, userChoresController.destroy);

module.exports = router;