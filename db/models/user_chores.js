'use strict';
module.exports = function(sequelize, DataTypes) {
    var user_chores = sequelize.define('user_chores', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        chore: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastcompleted: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        classMethods: {
            associate: function(models) {
                user_chores.belongsTo(models.chores_tracker_user, {
                    foreignKey: 'username',
                    onDelete: 'CASCADE',
                });
            }
        }
    });
    return user_chores;
};