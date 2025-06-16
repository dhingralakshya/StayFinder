'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Define associations here if needed in the future.
     * This method will be called automatically by models/index.js.
     */
    static associate(models) {
      // Example: User.hasMany(models.Listing, { foreignKey: 'hostId' });
      // Define associations here as your app grows.
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('guest', 'host'),
        allowNull: false,
        defaultValue: 'guest',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users', // Ensures consistency with your migration
      timestamps: true,   // Enables automatic createdAt and updatedAt
    }
  );

  return User;
};
