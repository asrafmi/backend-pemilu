const express = require('express')
const axios = require('axios')
const userRouter = require('./router/users')
const filmRouter = require('./router/films')
const peopleRouter = require('./router/peoples')
const { response } = require('express')
const res = require('express/lib/response')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"swapi"
})

function fetchPeople() {
    const urlPeople = 'https://swapi.dev/api/people'
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
        .catch((error) => {
            console.log(error)
        })
        
    })
    .catch((error) => {
        console.log(error)
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

app.use(filmRouter)

app.use(peopleRouter)

app.listen(8080, function() {
    console.log('Server aman')
})

