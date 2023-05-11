import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelizeDB = new Sequelize('app', '', '', {
    storage: './text.sqlite',
    dialect: 'sqlite',
    logging: false
})


