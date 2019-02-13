//importing bcrypt fro password hashing
const bcryptjs = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
     password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[6,10]
      }
    },
    photo:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    }
  });

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Users.prototype.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Users.hook("beforeCreate", function (user) {
    user.password = bcryptjs.hashSync(user.password, bcryptjs.genSaltSync(10), null);
    console.log(user);
  });

  //defining the association of the users and journals
  Users.associate = models =>{
    // Associating Users with Journals
    // When a user is deleted, also delete any associated Journals
    Users.hasMany(models.Journals, {
      onDelete: "cascade"
    });  
  };

  //defining the association of the users and entries  // but not sure will need it but good to know that it's there
  Users.associate = models =>{
    // Associating Users with Journals
    // When a user is deleted, also delete any associated Journals
    Users.hasMany(models.Entries, {
      onDelete: "cascade"
    });  
  };
  return Users;
};