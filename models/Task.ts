import {DataTypes, Model, Sequelize} from "sequelize";

const db = require('./index')
const sequelize = db.sequelize
export class Task extends Model {
    done: boolean;
    label: string;
    body: string;
}

Task.init({
    label: DataTypes.STRING,
    body: DataTypes.STRING,
    done: DataTypes.BOOLEAN,
}, {
    sequelize,
    modelName: 'Task'
});

