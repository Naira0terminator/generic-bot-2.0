import { sequelize } from '../services/database';
import { DataTypes, NOW } from 'sequelize';

export default sequelize.define('marriage', {

    guild: DataTypes.TEXT,

    couple: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.TEXT)),
        allowNull: false,
    },

    date: {
        type: DataTypes.DATE,
        defaultValue: NOW
    }
});