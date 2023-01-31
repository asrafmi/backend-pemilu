const express = require('express')
const axios = require('axios')
const userRouter = require('./router/users')
const getIdKecamatan = require('./router/utils/id_kecamatan')
const kelurahanRouter = require('./router/kelurahan')
const cityRouter = require('./router/city')
const provinceRouter = require('./router/province')
const kecamatanRouter = require('./router/kecamatan')
const { response } = require('express')
const res = require('express/lib/response')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "phpmyadmin/phpmyadmin",
    user:"root",
    password:"12345678",
    database:"pemilu",
    port: 5501
})

con.connect((err) => {
    if (err) return err
    console.log('Connected to Mysql');
})
// console.log(con);

function fetchProvinsi() {
    const urlPeople = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
    return axios.get(urlPeople)
}

function fetchFilm() {
    const urlFilm = 'https://swapi.dev/api/films'
    return axios.get(urlFilm)
}

app.get('/', function(request, response) {
    response.send("<h2>Welcome</h2>")
})

app.get('/both', function(req,res) {
    let parsedPeople = []
    fetchPeople()
    .then((response) => {
        for (let i = 0; i < response.data.results.length; i++){
            parsedPeople.push({name: response.data.results[i].name,
                height: response.data.results[i].height,
                mass: response.data.results[i].mass
            })
        }
        let parsedFilm = []
        fetchFilm()
        .then((response) => {
            for (let i = 0; i < response.data.results.length; i++){
                parsedFilm.push({title: response.data.results[i].title,
                director: response.data.results[i].director,
                producer: response.data.results[i].producer
                })
            }
            res.json({parsedPeople,parsedFilm})
        })
        
    })

})

app.get('/people/:id', function(req,res) {
    const id = req.params.id
    const url = "https://swapi.dev/api/people/"+ id
    axios.get(url)
    .then( async (response) => {
        
        let persons = {}
        persons={
            
            name: response.data.name,
            height: response.data.height,
            mass: response.data.mass
        }
        let films = []
        for (var i = 0; i < response.data.films.length; i++){
            var respon = await axios.get(response.data.films[i])       
            const filmName = respon.data.title
            films.push(filmName)
            persons.films = films
        }
        res.json(persons)
        console.log(persons)
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/films/:id', function(req,res) {
    const id = req.params.id
    const url = "https://swapi.dev/api/films/"+ id
    axios.get(url)
    .then( async (response) => {
        
        let films = {}
        films={
            
            title: response.data.title,
            director: response.data.director,
            producer: response.data.producer
        }
        let persons = []
        for (var i = 0; i < response.data.characters.length; i++){
            var respon = await axios.get(response.data.characters[i])       
            const charName = respon.data.name
            persons.push(charName)
            films.persons = persons
        }
        res.json(films)
        console.log(films)
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/about', function(request, response) {
    response.redirect('https://www.instagram.com/meliaantkaa/')
})

app.use(userRouter)

app.use(getIdKecamatan)

app.use(kelurahanRouter)

app.use(cityRouter)

app.use(provinceRouter)

app.use(kecamatanRouter)

app.listen(8080, function() {
    console.log('Server aman')
})

