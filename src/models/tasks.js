const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    description : {
        type: String, 
        required: true,
        trim: true
    },
    completed : {
        type: Boolean,
        required: false,
        default: false
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task