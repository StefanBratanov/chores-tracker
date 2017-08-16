'use strict';

module.exports = function(sequelize, DataTypes) {
    var chores_tracker_user = sequelize.define('chores_tracker_user', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Todo.hasMany(models.user_chores, {
                    foreignKey: 'username'
                });
            }
        }
    });
    return chores_tracker_user;
};