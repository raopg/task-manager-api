const express = require('express')
const router =  new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/users')
const multer =  require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')


router.get('/test', (req, res) =>{
    res.send('This is my test router')
})

router.post('/users', async (req, res) =>{
    const newUser = new User(req.body)

    try {
        sendWelcomeEmail(newUser.email, newUser.name) //No need to make this async/await since it can run in the background
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    } catch (e){
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e){
        res.status(400).send()
    }   
})

router.post('/users/logout', auth, async (req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) =>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth, async (req,res) =>{
    // The previous functionality is bad in terms of security. There is no need for one user to know the details of another.
    // This endpoint is repurposed to show the user profile of the logged-in user. The middleware function 'auth' takes care of this.

    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every( (update) =>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // const _id = req.params.id
        // const user =  await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)

    }
})

router.delete('/users/me', auth, async (req, res) =>{
    try{
        // if(!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

const upload =  multer({
    limits :{
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(file.originalname.match(/\.(jp(e)?g|png)$/)){
            return cb(undefined, true)
        }
        cb(new Error('Please upload an image.'))
        
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message}) //Handles the middleware throwing errors.

})

router.delete('/users/me/avatar', auth, async (req, res) =>{
    try{
        req.user.avatar =  undefined
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) =>{
    try{
        const user =  await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})


module.exports = router