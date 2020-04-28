'use strict';
let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Please enter a first name'
        }
      }
    },
      
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please give a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32],
          msg: 'please enter a password between 6 and 32 characters'
        }
      }
    },
    birthday: DataTypes.DATE,
    displayname: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    pic:DataTypes.STRING,
    bio: DataTypes.TEXT,
    admin: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        // Hash the password
        let hashedPassword = bcrypt.hashSync(pendingUser.password, 12)
        // Reassign the hashed password (overwrite the plain text password)
        pendingUser.password = hashedPassword
      }
    }
  })
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.discussion)
  }

  user.prototype.getFullName = function() {
    return this.displayname
  }

  user.prototype.validPassword = function(typedInPassword) {
    // Determine if the password typed in hashes to the same thing as the existing hash
    let correctPassword = bcrypt.compareSync(typedInPassword, this.password)

    // Return the (boolen) result of the comparison
    return correctPassword
  }
  return user
};