const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const config = require("../config")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Loading User Model
// Carregando Model de usuário
    require('../model/User')
    const User = mongoose.model('users')


// Router
    /*
        Register Route:
        The goal of this route, is create new users.        
        It receives three parameters: Name, Password and Email, if one of those is null, the API Will return a json with error message

        Rota register:
        O Objetivo desta routa é criar novos usuários
        Ela recebe três parâmetros: Nome, senha e email, se um deles for nulo a API Vai retornar um json com um mensagem de erro
    */
    router.post('/register', (req, res) => {
        // Server-side Verification
            // Validating E-mail
            // Validando E-mail
                if(!req.body.email || req.body.email == null || typeof req.body.email == undefined){
                    res.json({success: false, msg: config.msgs.invalidEmail})
                }
            // Validating name
            // Validando nome
                if(!req.body.name || req.body.name == null || typeof req.body.name == undefined){
                    res.json({success: false, msg: config.msgs.invalidName})
                }
            // Validating password
            // Validando senha
                if(!req.body.password || req.body.password == null || typeof req.body.password == undefined){
                    res.json({success: false, msg: config.msgs.invalidPassword})
                }
                // Validating password's size
                // Validando o tamanho da senha
                    if(req.body.password.length < config.passwordMinLength){
                        res.json({success: false, msg: config.msgs.weakPassword})
                    }
            // Creating user:
            // Criando usuário:
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    // Checking if user already exists in database
                    // Checando se o usuário já existe no banco de dados
                        User.findOne({email: newUser.email}).then((user) => {
                            if(user){
                                return res.json({success: false, msg: config.msgs.userAleadyExists})
                            }else{
                                // Hashing password
                                // 'Hasheando' a senha 
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                        if(err){
                                            res.sendStatus(403)
                                        }
                                        newUser.password = hash
                                        new User(newUser).save().then(() => {
                                            res.json({success: true, msg: config.msgs.userCreated})
                                        }).catch(err => {
                                            res.json({success: false, msg: config.msgs.userSaveFailed})
                                        })
                                    })
                                })
                            }
                        }).catch(err => {
                            res.sendStatus(403)
                        })
    })

    router.post('/authenticate', (req, res) => {
        // Server-side Verification
            // Validating E-mail
            // Validando E-mail
            if(!req.body.email || req.body.email == null || typeof req.body.email == undefined){
                res.json({success: false, msg: config.msgs.invalidEmail})
            }

        // Validating password
        // Validando senha
            if(!req.body.password || req.body.password == null || typeof req.body.password == undefined){
                res.json({success: false, msg: config.msgs.invalidPassword})
            }
        
        // Authenticating user:
            User.findOne({email: req.body.email}).then(user => {
                if(user){
                    // Comparando senha
                        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                            if(isMatch){
                                // Generate JWT(Json Web Token)
                                // Gerando o token
                                    const token = jwt.sign({data: user}, config.secret, {
                                        expiresIn: config.tokenExpireTime
                                    })
                                // Sending JWT to the client
                                // Enviando o token para o cliente
                                    res.json({
                                        success: true,
                                        token: 'Bearer '+token,
                                        user:{
                                            id: user._id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    })

                            }else{
                                res.json({success: false, msg: config.msgs.wrongPassword})
                            }
                        })


                }else{
                    res.json({success: false, msg: config.msgs.userNotExists})
                }
            }).catch(err => {
                res.sendStatus(403)
            })
    })

module.exports = router