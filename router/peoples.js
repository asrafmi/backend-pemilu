const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "swapi"
})

function fetchPeople() {
    const urlPeople = 'https://swapi.dev/api/people'
    return axios.get(urlPeople)
}

router.route('/peoples')
    .get(function(req,res) {
        fetchPeople()
        .then((response) => {
            let parsedPeople = []
            for (let i = 0; i < response.data.results.length; i++){
                parsedPeople.push({ name: response.data.results[i].name,
                height: response.data.results[i].height,
                mass: response.data.results[i].mass})
                for(let j = 0; j < response.data.results[i].films.length; j++){
                    console.log(response.data.results[i].films[j])
                    axios.get(response.data.results[i].films[j])
                }
                // for (let j = 0; j < response.data.films.length; j++){
                // }
            }
            res.json(parsedPeople)

            // for(let k = 0; k <parsedPeople.length; k++){
            //     var sql = "INSERT INTO peoples (name,height,mass) VALUES ('" + parsedPeople[k].name + "', '" + parsedPeople[k].height + "', '" + parsedPeople[k].mass + "')"
            //     con.query(sql,function(err,result){
            //         console.log("records inserted:"+result.affectedRows)
            //     })
            // }

        })
        .catch((error) => {
            console.log(error)
        })
    })
    .post(function(req,res) {
        fetchPeople()
        .then((response) => {
            let parsedPeople = []
            for (let i = 0; i < response.data.results.length; i++){
                parsedPeople.push({ name: response.data.results[i].name,
                height: response.data.results[i].height,
                mass: response.data.results[i].mass})
            }
            parsedPeople.push(req.body)
            res.send({
                status: true,
                data: parsedPeople,
                message: "Data berhasil disimpann",
                method: req.method,
                url: req.url
            })

        })
        .catch((error) => {
            console.log(error)
        })
    })

module.exports = router