import { sequelize } from '../services/database';
import { DataTypes, NOW } from 'sequelize';

export default sequelize.define('marriage', {
    spouce1: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    spouce2: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    date: {
        type: DataTypes.DATE,
        defaultValue: NOW
    }
});