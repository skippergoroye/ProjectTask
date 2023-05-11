import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelizeDB = new Sequelize('app', '', '', {
    storage: './taskt.sqlite',
    dialect: 'sqlite',
    logging: false
})


