module.exports = {
    verifyToken: function (req, res, next){
            const bearerHeader = req.headers['authorization']
            if(typeof bearerHeader !== 'undefined'){
                // Split at the space
                const bearer = bearerHeader.split(' ')
                const bearerToken = bearer[1]
                req.token = bearerToken
                next()
            }else{
                res.sendStatus(403)
            }
    }
}