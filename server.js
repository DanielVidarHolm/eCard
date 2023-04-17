const express = require('express')
const session = require('express-session')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

let db
const USERS = 'users'

MongoClient.connect(process.env.MONGO_CONNECTION_STRING, {useUnifiedTopology:true})
    .then(client => {
        db = client.db('CMS')
        console.log('Connected to Database')
    })


app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

app.get('/profile/:username',(req, res) => {
    const username = req.params.username
    db.collection(USERS).findOne({
        username: username
    })
    .then(data => {
        res.render('pages/ecard.ejs', {user:data})
    })
    .catch(err => console.error(err))

    
})

app.get('/profile/:username/edit', (req,res) => {
    if(session.username === req.params.username){
        const username = req.params.username
        db.collection(USERS).findOne({
            username: username
        })
        .then(data => {
            res.render('pages/ecardEdit.ejs', {user:data})
        })
        .catch(err => console.error(err))
        }
        
})

app.get('/login', (req, res) => {
    res.render('pages/login.ejs')
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}. You better go catch it!`)
})