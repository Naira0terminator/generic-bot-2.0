import { sequelize } from '../services/database';
import { DataTypes } from 'sequelize';

export default sequelize.define('settings', {
    guildID: {
        primaryKey: true,
        type: DataTypes.TEXT,
        allowNull: false,
    },

    settings: {
		type: DataTypes.JSON,
		allowNull: false,
	},
})