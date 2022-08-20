const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

router.route('/users')
    .get(userController.index) 
    .post(userController.post)
    

router.put('/users/:id', function(request, response){
    const id = request.params.id
    users.filter(user => {
        if(user.id == id){
            user.id = id
            user.nama = request.body.nama
            user.email = request.body.email

            return user
        }
    })
    response.json({
        status: true,
        data: users,
        message: "Data berhasil diupdate",
        method: request.method,
        url: request.url
    })
})

router.delete('/users/:userId', function(request, response){
    let id = request.params.userId
    users = users.filter(user => user.id != id)
    response.send({
        status: true,
        data: users,
        message: "Data berhasil dihapuss",
        method: request.method,
        url: request.url
    })
})

module.exports = router