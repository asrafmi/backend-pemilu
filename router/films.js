const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"swapi"
})


function fetchFilm() {
    const urlFilm = 'https://swapi.dev/api/films'
    return axios.get(urlFilm)
}

router.route('/films')
    .get(function(req,res) {
        fetchFilm()
        .then((response) => {
            let parsedFilm = []
            for (let i = 0; i < response.data.results.length; i++){
                parsedFilm.push({title: response.data.results[i].title,
                director: response.data.results[i].director,
                producer: response.data.results[i].producer
                })
            }
            res.json(parsedFilm)

            for(let j = 0; j < parsedFilm.length; j++){
                var sql = "INSERT INTO films (title,director,producer) VALUES ('" + parsedFilm[j].title + "', '" + parsedFilm[j].director + "', '" + parsedFilm[j].producer + "')"

                con.query(sql,parsedFilm,function(err,result) {
                    console.log("records inserted:"+result.affectedRows)
                })
            }

        })
        .catch((error) => {
            console.log(error)
        })

    })
    .post(function(req,res) {
        fetchFilm()
        .then((response) => {
            let parsedFilm = []
            for (let j = 0; j < response.data.results.length; j++){
                parsedFilm.push({title: response.data.results[j].title,
                director: response.data.results[j].director,
                producer: response.data.results[j].producer})
            }
            parsedFilm.push(req.body)
            res.send({
                status: true,
                data: parsedFilm,
                message: "Data berhasil disimpann",
                method: req.method,
                url: req.url 
            })
        })
    })

    module.exports = router