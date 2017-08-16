const user_chores = require('../models').user_chores;

module.exports = {
    list(req, res) {
        
        return user_chores
            .all({
                where: {
                    username: req.user.username
                }
            })
            .then(chores => res.status(200).send(chores))
            .catch(error => res.status(400).send(error));
    },
    create(req, res) {

        return user_chores
            .create({
                username: req.user.username,
                chore: req.body.chore,
                lastcompleted: req.body.lastcompleted
            })
            .then(chore => res.status(201).send(chore))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {

        var values = {
            lastcompleted: req.body.lastcompleted
        };
        var selector = {
            where: {
                username: req.user.username,
                chore: req.body.chore,
            }
        };
        return user_chores
            .update(values, selector)
            .then(updatedChore => res.status(200).send(updatedChore))
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res) {
        var selector = {
            where: {
                username: req.user.username,
                chore: req.body.chore,
            }
        };

        return user_chores
            .destroy(selector)
            .then(() => res.status(204).send())
            .catch(error => res.status(400).send(error));
    }
};