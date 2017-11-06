const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1,10]
      }
    },
    password_digest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6,20]
      }
    },
    password_confirmation: {
      type:DataTypes.VIRTUAL
    }
  });

  const hasSecurePassword = (user, options) =>{
    if(user.password != user.password_confirmation){
      throw new Error("Password and Password confirmation don't match");
    }
    let hash = bcrypt.hashSync(user.get('password'),10)
    user.password_digest = hash;
  };

  User.beforeCreate((user, options)=>{
    if(user.password){
      hasSecurePassword(user, options);
    }else{
      return new Error("No password!")
    }
  });

  return User;
};
