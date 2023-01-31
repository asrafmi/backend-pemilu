const express = require ('express')
const router = express.Router()
const axios = require('axios')
const mysql = require('mysql')
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

function fetchKota(id) {
    const urlFilm = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`
    return axios.get(urlFilm)
}

router.route('/kota')
    .get(async function(req,res) {
        var idProvinsi = [
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 31, 32, 33, 34, 35, 36, 51, 52,
            53, 61, 62, 63, 64, 65, 71, 72, 73,
            74, 75, 76, 81, 82, 91, 94
          ]
        var tampungKota = []
        for (let i = 0; i < 34; i++) {
            await fetchKota(idProvinsi[i])
            .then(async (response) => {
                var parsedKota = []
                for (let j = 0; j < response.data.kota_kabupaten.length; j++){
                    await parsedKota.push({nama: response.data.kota_kabupaten[j].nama, id_provinsi: i+1})
                    console.log(response.data.kota_kabupaten[j].nama);
                }
                // console.log(parsedKota);
                await tampungKota.push(parsedKota)
                console.log("tampung kota",tampungKota);
            })
            .catch((error) => {
                console.log(error)
            })
        }
        // console.log(tampungKota);
        res.json(tampungKota)
    })
    .post( async function(req,res) {
        var idProvinsi = [
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 31, 32, 33, 34, 35, 36, 51, 52,
            53, 61, 62, 63, 64, 65, 71, 72, 73,
            74, 75, 76, 81, 82, 91, 94
          ]
        var tampungKota = []
        for (let i = 0; i < 34; i++) {
            await fetchKota(idProvinsi[i])
            .then(async (response) => {
                var parsedKota = []
                for (let j = 0; j < response.data.kota_kabupaten.length; j++){
                    await parsedKota.push({nama: response.data.kota_kabupaten[j].nama, id_provinsi: i+1})
                    console.log(response.data.kota_kabupaten[j].nama);
                }
                // console.log(parsedKota);
                await tampungKota.push(parsedKota)
                console.log("tampung kota",tampungKota);
    
                for(let j = 0; j < parsedKota.length; j++){
                    // console.log(parsedKota);
                    var sql = "INSERT INTO kota (nama,id_provinsi) VALUES ('" + parsedKota[j].nama + "', '" + parsedKota[j].id_provinsi + "')"
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
            data: tampungKota,
            message: "Data berhasil disimpann",
            method: req.method,
            url: req.url 
        })
    })

    module.exports = router