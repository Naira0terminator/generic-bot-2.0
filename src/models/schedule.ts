import { sequelize } from '../services/database';
import { DataTypes } from 'sequelize';

export default sequelize.define('schedule', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },

    data: {
        allowNull: false,
        type: DataTypes.JSON
    }

});