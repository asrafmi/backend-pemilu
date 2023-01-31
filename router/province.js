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

router.route('/provinsi')
    .get(function(req,res) {
        fetchProvinsi()
        .then((response) => {
            let parsedProvinsi = []
            console.log(response.data.provinsi);
            console.log(response.data.provinsi.length);
            for (let i = 0; i < response.data.provinsi.length; i++){
                parsedProvinsi.push({nama: response.data.provinsi[i].nama})
            }
            res.json(parsedProvinsi)
            console.log(parsedProvinsi);
        })
    })
    .post(function(req,res) {
        fetchProvinsi()
        .then((response) => {
            let parsedProvinsi = []
            for (let i = 0; i < response.data.provinsi.length; i++){
                parsedProvinsi.push({ nama: response.data.provinsi[i].nama})
            }
            parsedProvinsi.push(req.body)
            console.log(parsedProvinsi);
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
                data: parsedProvinsi,
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