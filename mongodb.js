const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = "mongodb://127.0.0.1:27018/"
const databaseName = "task-manager"


MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database: ' + error)
    } 

    const db = client.db(databaseName)

    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("5cd8fe7952b959a13b28a75a"),
    // },{
    //     $set : {name : "Jacob"}
    // })

    // updatePromise.then((result) =>{
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("5cd8fe7952b959a13b28a75a"),
    },{
        $set : {name : "Jacob"}
    }).then((result) =>{                                              //// More concise syntax.
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


    db.collection('tasks').updateMany({completed : false}, {
        $set: {completed : true}
    }).then((result)=>{
        console.log(result)
    }).catch((error) =>{
        console.log(error)
    })

    db.collection('users').deleteMany({age: 20}).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    })

    db.collection('tasks').deleteOne(
        {description : "Do more HW"}
    ).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    })
})
