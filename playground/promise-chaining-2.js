require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.findByIdAndDelete('5ce7028ea93676609e713d4c').then((result)=>{
//     console.log(result)
//     return Task.countDocuments({completed: false})
// }).then((tasks) =>{
//     console.log(tasks)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    const count =  await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount("5ce63ed0e65ae55af122c602").then((count) =>{
    console.log("Count: " , count)
}).catch((e) =>{
    console.log(e)
})