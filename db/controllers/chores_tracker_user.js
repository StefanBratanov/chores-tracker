const bcrypt = require('bcryptjs');
const chores_tracker_user = require('../models').chores_tracker_user;

module.exports = {
    create(req, res) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(req.body.password, salt);
        return chores_tracker_user
            .create({
                username: req.body.username,
                password: hash
            })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error));
    },
};