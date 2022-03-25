'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model{}
    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Title can not be left empty"
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Author can not be left empty"
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.DATEONLY
    }, {
        sequelize
    });

    return Book;
}