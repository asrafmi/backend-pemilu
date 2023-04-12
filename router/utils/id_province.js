const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "12345678",
    database: "pemilu",
    port: 5500
})

con.connect((err) => {
    if (err) {
        return console.log("ERROR KETIKA CONNECT", err);
    } else {
        console.log('Connected to Mysql');
    }
})
// console.log(con);


function fetchProvinsi() {
    const urlPeople = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
    return axios.get(urlPeople)
}

router.route('/id-provinsi')
    .get(function(req,res) {
        fetchProvinsi()
        .then((response) => {
            let parsedProvinsi = []
            console.log(response.data.provinsi);
            console.log(response.data.provinsi.length);
            for (let i = 0; i < response.data.provinsi.length; i++){
                parsedProvinsi.push(response.data.provinsi[i].id)
            }
            res.json(parsedProvinsi)
            console.log(parsedProvinsi);
        })
    })
    .post(function(req,res) {
        fetchProvinsi()
        .then((response) => {
            let parsedPeople = []
            for (let i = 0; i < response.data.results.length; i++){
                parsedPeople.push({ name: response.data.results[i].name,
                height: response.data.results[i].height,
                mass: response.data.results[i].mass})
            }
            parsedPeople.push(req.body)
            for(let k = 0; k < parsedProvinsi.length; k++){
                var sql = "INSERT INTO provinsi (nama) VALUES ('" + parsedProvinsi[k].nama + "')"
                console.log(sql);
                con.query(sql,function(err,result){
                    if (err) console.log("ERROR KETIKA INSERT",err);
                    console.log("records inserted:"+result.affectedRows)
                })
            }
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