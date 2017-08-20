var express = require('express');
var user_chores = require('../db/models').user_chores;
var moment = require('moment')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.user) {
        return res.redirect('/login');
    }

    user_chores
        .all({
            raw: true,
            order: [
                ['chore', 'ASC']
            ],
            where: {
                username: req.user.username
            }
        })
        .then(function(data) {
            var updatedData = data.map(function(dataToBeUpdated) {
                var lastCompletedTime = dataToBeUpdated.lastcompleted;
                if (lastCompletedTime === null) {
                    dataToBeUpdated.lastcompleted = 'Never';
                } else {
                    var startDate = moment(lastCompletedTime);
                    var endDate = moment();
                    var daysDiff = Math.abs(startDate.diff(endDate, 'days'));
                    if (daysDiff === 0) {
                        var hoursDiff = Math.abs(startDate.diff(endDate, 'hours'));
                        dataToBeUpdated.lastcompleted = '0 days ( ' + hoursDiff + 'h) ago';
                    } else if (daysDiff === 1) {
                         dataToBeUpdated.lastcompleted = daysDiff + ' day ago';
                    } else {
                        dataToBeUpdated.lastcompleted = daysDiff + ' days ago';
                    }
                }
                return dataToBeUpdated
            })
            res.render('index', {
                title: 'Chore Tracker',
                choreDetails: updatedData,
                username: req.user.username
            });
        });

});

/* GET Login page. */
router.get('/login', function(req, res, next) {
    if (req.user) {
        res.redirect('/');
    }
    res.render('login', {
        title: 'Login'
    });
});

//Necessary for OPENSHIFT
router.get('/health', function(req, res, next) {
    return res.status(200).json({ status: "success" });
});

module.exports = router;