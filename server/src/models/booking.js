'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      // Each booking belongs to a user (the guest)
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      // Each booking belongs to a listing
      Booking.belongsTo(models.Listing, {
        foreignKey: 'listingId',
        as: 'listing'
      });
    }
  }

  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      listingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Listings',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
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
      modelName: 'Booking',
      tableName: 'Bookings',
      timestamps: true,
    }
  );

  return Booking;
};
