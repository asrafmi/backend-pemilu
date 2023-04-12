const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
const tampungIdKecamatan = require('../db/id/id-kecamatan')
const con = mysql.createConnection({
    host: "127.0.0.1",
    user:"root",
    password:"12345678",
    database:"pemilu",
    port: 5500
})

con.connect((err) => {
    if (err) return err
    console.log('Connected to Mysql');
})
// console.log(con);

function fetchKelurahan(id) {
    const urlFilm = `https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${id}`
    return axios.get(urlFilm)
}


router.route('/kelurahan')
    .get(async function(req,res) {
        var tampungKelurahan = []
        for (let i = 0; i < tampungIdKecamatan.idKecamatan.length; i++) {
            await fetchKelurahan(tampungIdKecamatan.idKecamatan[i])
            .then(async (response) => {
                let parsedKelurahan = []
                console.log(response.data);
                for (let i = 0; i < response.data.kelurahan.length; i++){
                    await parsedKelurahan.push({nama : response.data.kelurahan[i].nama,
                    id_kecamatan : response.data.kelurahan[i].id_kecamatan, id : response.data.kelurahan[i].id
                    })
                }
                console.log(parsedKelurahan);
                await tampungKelurahan.push(parsedKelurahan)
            })
            .catch((error) => {
                console.log(error)
            })
        }
        await res.json(tampungKelurahan)
    })
    .post( async function(req,res) {
        var tampungKelurahan = []
        for (let i = 0; i < tampungIdKecamatan.idKecamatan.length; i++) {
            await fetchKelurahan(tampungIdKecamatan.idKecamatan[i])
            .then(async (response) => {
                var parsedKelurahan = []
                for (let j = 0; j < response.data.kelurahan.length; j++){
                    await parsedKelurahan.push({nama: response.data.kelurahan[j].nama, id_kecamatan : response.data.kelurahan[j].id_kecamatan, id : response.data.kelurahan[j].id})
                }
                await tampungKelurahan.push(parsedKelurahan)    
                for(let j = 0; j < parsedKelurahan.length; j++){
                    var sql = "INSERT INTO kelurahan (id_kelurahan,nama,id_kecamatan) VALUES ('" + parsedKelurahan[j].id + "', '" + parsedKelurahan[j].nama + "', '" + parsedKelurahan[j].id_kecamatan + "')"
                    con.query(sql,function(err,result) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(sql)
                            console.log("records inserted:"+result)
                        }
                    })
                }
                
            })                        
        }
        res.send({
            status: true,
            data: tampungKelurahan,
            message: "Data berhasil disimpann",
            method: req.method,
            url: req.url 
        })
    })

module.exports = router