module.exports = function(sequelize, DataTypes) {
  var Journals = sequelize.define("Journals", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    description: {
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

  //defining the association of the journals and entries
  Journals.associate = models => {
    // Associating Users with Journals
    // When a user is deleted, also delete any associated Journals
    Journals.hasMany(models.Entries, {
      onDelete: "cascade"
    });  
  };

  //backward relation btw journals and users
  Journals.associate = models=> {
    // A Journal belongs to an user
    // and can't be created without an users id associate as the foreign key constraint
    Journals.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });
  };

    return Journals;
};