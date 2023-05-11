import { DataTypes, Model } from 'sequelize';
import {sequelizeDB} from '../Database/index';




export interface AdminAttributes {
    id: string;
    email: string;
    password: string;
    salt: string;
    role: string;
}



export class AdminInstance extends Model<AdminAttributes> {}


AdminInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email address is required",
          },
          isEmail: {
            msg: "please provide a valid email",
          },
        },
      },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull:{
                msg: "Password is required"
            },
            notEmpty:{
                msg: "Provide a password"
            },
        }
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    }
},
{ 
    sequelize: sequelizeDB,
    tableName: 'admin',
    timestamps: true
});









