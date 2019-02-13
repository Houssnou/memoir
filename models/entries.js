module.exports = function (sequelize, DataTypes) {
  var Entries = sequelize.define("Entries", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    isTrashed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  //backward relation btw entries and journals
  Entries.associate = models => {
    // An entry belongs to a journal
    // and can't be created without a journal id associate as the foreign key constraint
    Entries.belongsTo(models.Journals, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  //not sure we need it but still good to know that we can have it.
  //backward relation btw entries and users
  /* Entries.associate = models => {
  // An entry belongs to a user
  // and can't be created without a user id associate as the foreign key constraint
  Entries.belongsTo(models.Users, {
    foreignKey: {
      allowNull: false
    }
  });
}; */

  return Entries;
};