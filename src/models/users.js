const mongoose = require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task =  require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required : true,
        unique: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid.')
            }
        },
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive, non-zero number')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannot contain the word 'password'.")
            }if(value.length < 7){
                throw new Error("Password cannot be shorter than 7 characters.")
            }

        }
    },
    tokens : [{
        token: {
            type : String,
            required: true
        }
    }],
    avatar :{
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} )

    if (!user){
        throw new Error ('Unable to Login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error ('Unable to Login') //Better to keep these errors generic since it does not give away information to a potential threat.
    }

    return user

    
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token =  jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)
    user.tokens =  user.tokens.concat({ token })
    await user.save()
    return token
    
}

userSchema.methods.toJSON =  function (){ // We are overloading the toJSON method, which is called when you pass the user to response body.
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
//Hash the plaintext password before saving.
userSchema.pre('save', async function (next) {
    const user  =  this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next){
    const user =  this
    
    await Task.deleteMany({creator: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
