const jwt =  require('jsonwebtoken')
const User =  require('../models/users')

const auth =  async (req, res, next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded =  jwt.verify(token, 'This is my new project')
        const user =  await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e) {
        res.status(401).send({error:"Please log in."})
    }
}


module.exports = auth