let users = [
    {id: 1, nama: "Asraf", email: "asraf@gmail.com"},
    {id: 2, nama: "Meli", email: "meli@gmail.com"}
]

module.exports = {
    index: function(request, response) {
        if(users.length > 0){
            response.json({
                status: true,
                data: users,
                method: request.method,
                url: request.url
            })
        } else {
            response.json({
                status: false,
                message: 'Data masih kosong bre'                
            })
        }
    },
    post: function(request,response) {
        users.push(request.body)
        response.send({
            status: true,
            data: users,
            message: "Data berhasil disimpann",
            method: request.method,
            url: request.url
        })
    }
}