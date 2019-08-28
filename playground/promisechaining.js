const add = (a,b) =>{
    return new Promise( (resolve, reject) =>{
        setTimeout(() =>{
            resolve(a+b)
        }, 2000)
    })
}

// // add(1,2).then((sum) =>{
// //     console.log(sum)

// //     add(sum,5).then((sum2) =>{
// //         console.log(sum2)
// //     }).catch((e) =>{
// //         console.log(e)
// //     })
// // }).catch((e) =>{
// //     console.log(e)
// // })

// add(1,1).then((sum) =>{
//     console.log(sum)
//     return add(sum,5)
// }).then((sum2) =>{
//     console.log(sum2)
// }).catch((e) =>{
//     console.log(e)
// })

// // You can achieve promise chaining by returning the promise from the second nested call, and then subsequently calling then() on the result.


require('../src/db/mongoose')
const User = require('../src/models/users')

//5ce63ed0e65ae55af122c602

// User.findByIdAndUpdate('5ce63ed0e65ae55af122c602', {age: 1}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({age: 1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e) =>{
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5ce63ed0e65ae55af122c602', 12).then((count)=>{
    console.log(count)

}).catch((e) =>{
    console.log(e)
})