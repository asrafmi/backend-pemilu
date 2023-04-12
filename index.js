const express = require('express')
const axios = require('axios')
const getIdKecamatan = require('./router/utils/id_kecamatan')
const getIdProvinsi = require('./router/utils/id_province')
const getIdCity = require('./router/utils/id_city')
const kelurahanRouter = require('./router/kelurahan')
const cityRouter = require('./router/city')
const provinceRouter = require('./router/province')
const kecamatanRouter = require('./router/kecamatan')
const { response } = require('express')
const res = require('express/lib/response')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "phpmyadmin/phpmyadmin",
    user: "root",
    password: "12345678",
    database: "pemilu",
    port: 5501
})

con.connect((err) => {
    if (err) return err
    console.log('Connected to Mysql');
})


app.use(getIdKecamatan)
app.use(getIdProvinsi)
app.use(getIdCity)

app.use(kelurahanRouter)

app.use(cityRouter)

app.use(provinceRouter)

app.use(kecamatanRouter)

app.listen(8080, function () {
    console.log('Server aman')
})

