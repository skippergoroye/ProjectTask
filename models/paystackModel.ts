import { DataTypes, Model } from 'sequelize';
import {sequelizeDB} from '../Database/index';



export interface TransactionAttributes {
    id?: string;
    amount: number;
    reference: string;
    status: string  

}




export class Transaction extends Model<TransactionAttributes> {}


Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{ 
    sequelize: sequelizeDB,
    tableName: 'transaction',
    timestamps: true
});
