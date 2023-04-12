const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
const tampungIdKota = require('../db/id/id-kota')
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

function fetchKecamatan(id) {
    const urlFilm = `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`
    return axios.get(urlFilm)
}

function fetchKota(id) {
    const urlFilm = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`
    return axios.get(urlFilm)
}

router.route('/kecamatan')
    .get(async function(req,res) {
        var tampungKecamatan = []
        for (let i = 0; i < tampungIdKota.idKota.length; i++) {
            // console.log(idKota);
            await fetchKecamatan(tampungIdKota.idKota[i])
            .then(async (response) => {
                let parsedKecamatan = []
                console.log(response.data);
                for (let i = 0; i < response.data.kecamatan.length; i++){
                    await parsedKecamatan.push({nama : response.data.kecamatan[i].nama,
                    id_kota : response.data.kecamatan[i].id_kota, id_kecamatan : response.data.kecamatan[i].id
                    })
                }
                console.log(parsedKecamatan);
                await tampungKecamatan.push(parsedKecamatan)
            })
            .catch((error) => {
                console.log(error)
            })
        }
        res.json(tampungKecamatan)
    })
    .post( async function(req,res) {
        var tampungKecamatan = []
        for (let i = 0; i < tampungIdKota.idKota.length; i++) {
            await fetchKecamatan(tampungIdKota.idKota[i])
            .then(async (response) => {
                var parsedKecamatan = []
                for (let j = 0; j < response.data.kecamatan.length; j++){
                    await parsedKecamatan.push({nama: response.data.kecamatan[j].nama, id_kota : response.data.kecamatan[j].id_kota, id_kecamatan : response.data.kecamatan[j].id})
                }
                await tampungKecamatan.push(parsedKecamatan)    
                for(let j = 0; j < parsedKecamatan.length; j++){
                    var sql = "INSERT INTO kecamatan (id_kecamatan,nama,id_kota) VALUES ('" + parsedKecamatan[j].id_kecamatan + "','" + parsedKecamatan[j].nama + "', '" + parsedKecamatan[j].id_kota + "')"
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
            data: tampungKecamatan,
            message: "Data berhasil disimpann",
            method: req.method,
            url: req.url 
        })
    })

module.exports = router