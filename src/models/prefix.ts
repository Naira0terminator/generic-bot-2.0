import { sequelize } from '../services/database';
import { DataTypes } from 'sequelize';

export default sequelize.define('prefix', {
    guild: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
    },

    prefix: DataTypes.TEXT,
});