const User = require ('../models').User;
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const bcrypt = require('bcrypt')

module.exports = {

  create(req,res){
    return User
    .create({
      username: req.body.username,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation,
    })
    .then(user => {
      const token = jwt.sign({
                    id: user.id,
                }, config.JWT_SECRET, { expiresIn: '24h' })
      const userInfo = { username: user.username, id: user.id, jwt: token}
      return res.status(201).send(userInfo)
    })
    .catch(error => {
      console.log(error)
      let message = {error: "Sign up error"}
      return res.status(401).send(message)
    })
  },

  login(req, res){

    return User.findOne({ where: { username: req.body.username } })
    .then(user=>{
      if(bcrypt.compareSync(req.body.password,user.password_digest)){
        const token = jwt.sign({
                      id: user.id,
                  }, config.JWT_SECRET, { expiresIn: '24h' })
        const userInfo = { username: user.username, id: user.id, jwt: token}
        return res.status(201).send(userInfo)
      } else {
        const error = {
          error: "Invalid Username or Password"
        }
        return res.status(401).send(error)
      }
    })
    .catch((err)=>{
      const error = {
        error: "Invalid Username or Password"
      }
      return res.status(401).send(error)
    })

  },

  getUser(req, res){

    const decodedToken = jwt.verify(req.headers['authorization'], config.JWT_SECRET)

    return User.findById(decodedToken.id)
    .then(user=>{
      const userInfo = { username: user.username, id: user.id }
      return res.status(201).send(userInfo)
    })
    .catch((err)=>{
      const error = {
        error: "Invalid Username or Password"
      }
      return res.status(401).send(error)
    })


  }

}
