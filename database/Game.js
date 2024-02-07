const Sequelize = require("sequelize");
const connection = require("./database");

const Game = connection.define('games', {
    title: {
        type: Sequelize.STRING,
        allownNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allownNull: false
    },
    price: {
        type: Sequelize.DECIMAL,
        alownNull: false
    }
});

Game.sync({force: false}).then(() => {});

module.exports = Game;