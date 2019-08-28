const express =  require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require("../models/tasks")

router.post('/tasks', auth, async (req,res) =>{
    const newTask = new Task({
        ...req.body,
        creator: req.user._id
    })

    try {
        await newTask.save()
        res.status(201).send(newTask)

    } catch(e){
        res.status(400).send(error)
    }
})
//GET /tasks?completed=true OR /tasks?completed=false
//GET /tasks?limit=10&skip=10 // The client will re-request the endpoint with different skip and limit values to get different pages to load.
//GET /tasks?sortby=createdAt_asc OR /tasks/?sortby=createdAt_desc
// Multi-faceted router endpoint to customize getting tasks.
router.get('/tasks', auth, async (req, res) =>{
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    const sort = {}

    if (req.query.sortBy){
        const parts =  req.query.sortBy.split("_")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch (e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) =>{
    const _id = req.params.id

    try{
        
        const task =  await Task.findOne({_id, creator: req.user._id}) //Filter by user ID.
        if(task === null){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth,  async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOperation = updates.every( (update) =>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, creator: req.user._id})
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach( (update) => task[update] = req.body[update] )

        res.send(task)
    } catch(e) {
        res.status(400).send(e)

    }
})

router.delete('/tasks/:id', auth, async (req, res) =>{
    try{
        const task =  await Task.findOneAndDelete({_id:req.params.id, creator: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch(e){
        res.status(500).send(e)
    }
})


module.exports = router