const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cors = require('cors')
const passport = require("passport")
const mongoose = require('mongoose')
const app = express()
const users = require('./routes/user')
const config = require('./config')
const jwt = require("jsonwebtoken")
// Loading Protect Route Helper
const {verifyToken} = require('./helper/protectRoute')


// Setup
    // Mongoose ODM config
        mongoose.Promise = global.Promise;
        mongoose.connect(config.databaseURI, {
            useMongoClient: true
        }).then(() => console.log('MongoDB Connected...'))
            .catch(err => console.log(err))
    // CORS Middleware
        app.use(cors())
    // Body Parser Middleware
        app.use(bodyParser.json());
    // Default Route
    app.get('/', (req, res) => {
        res.json({msg: 'Invalid Endpoint'})
    })

// Routes
    app.use('/users', users)

    app.post('/protectedRoute/test', verifyToken, (req, res) => {  
        jwt.verify(req.token, config.secret, (err, authData) => {
          if(err) {
            // Msg que será exibida caso o usuário não esteja autênticado
             res.json({msg: "unauthorized"});
          } else {
            res.json({
              msg: "YOU'RE AUTHENTICATED :) Congrats!!!",
              authData
            });
          }
        });
      });


app.listen(config.port, () => {
    console.log("Up and Running!")
})